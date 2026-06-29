import type { BigExcelCellValue, ExportBigExcelOptions } from './types';
import type { BigExcelWorkerInMessage, BigExcelWorkerOutMessage } from './protocol';

const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const isAbortError = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  return err.name === 'AbortError' || err.message.includes('aborted');
};

const getCellValue = <T>(
  row: T,
  colIndex: number,
  columns: ReadonlyArray<{ key?: keyof T | string; valueGetter?: (r: T) => BigExcelCellValue }>,
): BigExcelCellValue => {
  const col = columns[colIndex];
  if (col.valueGetter) return col.valueGetter(row);
  if (!col.key) return undefined;
  const key = col.key as keyof T;
  return (row as Record<string, unknown>)[String(key)] as BigExcelCellValue;
};

export const exportBigExcel = async <T>(options: ExportBigExcelOptions<T>): Promise<void> => {
  const {
    fileName,
    sheetName = 'Sheet1',
    columns,
    fetcher,
    chunkSize = 5000,
    onProgress,
    signal,
  } = options;

  if (columns.length === 0) return;

  if (signal?.aborted) {
    throw new DOMException('Export aborted', 'AbortError');
  }

  const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

  let done = false;
  let resolveResult: ((buffer: ArrayBuffer) => void) | null = null;
  let rejectResult: ((err: Error) => void) | null = null;

  const waitResult = (): Promise<ArrayBuffer> =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      resolveResult = resolve;
      rejectResult = reject;
    });

  const terminate = (): void => {
    try {
      worker.postMessage({ type: 'cancel' } satisfies BigExcelWorkerInMessage);
    } catch {
      // ignore
    }
    worker.terminate();
  };

  const abortHandler = (): void => {
    terminate();
  };

  signal?.addEventListener('abort', abortHandler, { once: true });

  worker.onmessage = (evt: MessageEvent<BigExcelWorkerOutMessage>) => {
    const msg = evt.data;
    if (msg.type === 'progress') {
      onProgress?.(msg.payload);
      return;
    }
    if (msg.type === 'result') {
      done = true;
      resolveResult?.(msg.payload.buffer);
      return;
    }
    if (msg.type === 'error') {
      rejectResult?.(new Error(msg.payload.message));
    }
  };

  worker.onerror = (evt: ErrorEvent) => {
    rejectResult?.(new Error(evt.message || 'BigExcel Worker 运行失败'));
  };

  try {
    worker.postMessage({
      type: 'init',
      payload: { sheetName, headers: columns.map((c) => c.header) },
    } satisfies BigExcelWorkerInMessage);

    let chunkIndex = 0;
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('Export aborted', 'AbortError');
      }

      const res = await fetcher({ chunkIndex, chunkSize, signal });
      const rows = res.rows ?? [];

      if (rows.length > 0) {
        const aoa: BigExcelCellValue[][] = rows.map((r) => {
          const line: BigExcelCellValue[] = new Array(columns.length);
          for (let i = 0; i < columns.length; i += 1) {
            line[i] = getCellValue(r, i, columns);
          }
          return line;
        });

        worker.postMessage({
          type: 'append',
          payload: { rows: aoa },
        } satisfies BigExcelWorkerInMessage);
      }

      chunkIndex += 1;

      const isDone = res.done === true || rows.length < chunkSize;
      if (isDone) break;
    }

    worker.postMessage({ type: 'finalize' } satisfies BigExcelWorkerInMessage);

    const buffer = await waitResult();
    if (signal?.aborted) {
      throw new DOMException('Export aborted', 'AbortError');
    }

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    downloadBlob(blob, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
  } catch (err) {
    if (!isAbortError(err)) {
      throw err instanceof Error ? err : new Error('导出失败');
    }
  } finally {
    signal?.removeEventListener('abort', abortHandler);
    if (!done) terminate();
    else worker.terminate();
  }
};

export type { ExportBigExcelOptions } from './types';
