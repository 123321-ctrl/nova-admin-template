import * as XLSX from 'xlsx';

import type { BigExcelCellValue, BigExcelProgress } from './types';
import type { BigExcelWorkerInMessage, BigExcelWorkerOutMessage } from './protocol';

let worksheet: XLSX.WorkSheet | null = null;
let workbook: XLSX.WorkBook | null = null;
let sheetName = 'Sheet1';

let writtenRows = 0;
let chunks = 0;

const post = (msg: BigExcelWorkerOutMessage, transfer?: Transferable[]): void => {
  if (transfer && transfer.length > 0) {
    self.postMessage(msg, transfer as unknown as string);
    return;
  }
  self.postMessage(msg);
};

const normalizeCell = (v: BigExcelCellValue): BigExcelCellValue => {
  if (v instanceof Date) return v;
  return v;
};

const ensureInitialized = (): void => {
  if (!worksheet || !workbook) {
    throw new Error('BigExcel Worker 未初始化，请先发送 init。');
  }
};

self.onmessage = (evt: MessageEvent<BigExcelWorkerInMessage>) => {
  try {
    const msg = evt.data;
    if (msg.type === 'cancel') {
      worksheet = null;
      workbook = null;
      sheetName = 'Sheet1';
      writtenRows = 0;
      chunks = 0;
      return;
    }

    if (msg.type === 'init') {
      const headers = msg.payload.headers;
      sheetName = msg.payload.sheetName || 'Sheet1';

      worksheet = XLSX.utils.aoa_to_sheet([headers]);
      workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      writtenRows = 0;
      chunks = 0;
      post({ type: 'ready' });
      return;
    }

    if (msg.type === 'append') {
      ensureInitialized();
      const rows = msg.payload.rows;
      if (rows.length === 0) return;

      const normalized: BigExcelCellValue[][] = rows.map((r) => r.map(normalizeCell));
      XLSX.utils.sheet_add_aoa(worksheet as XLSX.WorkSheet, normalized, { origin: -1 });

      writtenRows += rows.length;
      chunks += 1;
      const progress: BigExcelProgress = { writtenRows, chunks };
      post({ type: 'progress', payload: progress });
      return;
    }

    if (msg.type === 'finalize') {
      ensureInitialized();

      const buffer = XLSX.write(workbook as XLSX.WorkBook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true,
      }) as ArrayBuffer;

      post({ type: 'result', payload: { buffer } }, [buffer]);
      return;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'BigExcel Worker 未知错误';
    post({ type: 'error', payload: { message } });
  }
};
