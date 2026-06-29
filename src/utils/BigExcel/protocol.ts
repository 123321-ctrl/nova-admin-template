import type { BigExcelCellValue, BigExcelProgress } from './types';

export interface BigExcelWorkerInitPayload {
  sheetName: string;
  headers: string[];
}

export interface BigExcelWorkerAppendPayload {
  rows: BigExcelCellValue[][];
}

export type BigExcelWorkerInMessage =
  | { type: 'init'; payload: BigExcelWorkerInitPayload }
  | { type: 'append'; payload: BigExcelWorkerAppendPayload }
  | { type: 'finalize' }
  | { type: 'cancel' };

export type BigExcelWorkerOutMessage =
  | { type: 'ready' }
  | { type: 'progress'; payload: BigExcelProgress }
  | { type: 'result'; payload: { buffer: ArrayBuffer } }
  | { type: 'error'; payload: { message: string } };
