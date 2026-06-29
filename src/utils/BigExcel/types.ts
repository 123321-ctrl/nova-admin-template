export type BigExcelCellValue = string | number | boolean | Date | null | undefined;

export interface BigExcelColumn<T> {
  header: string;
  /**
   * 优先使用 key 从行对象里取值；复杂场景建议用 valueGetter。
   * key 支持 string（例如后端字段名），也支持 keyof T（类型更友好）。
   */
  key?: keyof T | string;
  valueGetter?: (row: T) => BigExcelCellValue;
}

export interface BigExcelProgress {
  /** 已写入的数据行数（不含表头） */
  writtenRows: number;
  /** 已拉取的分片数 */
  chunks: number;
}

export interface BigExcelFetchContext {
  /** 从 0 开始的分片索引 */
  chunkIndex: number;
  /** 每片最大行数 */
  chunkSize: number;
  /** 取消信号 */
  signal?: AbortSignal;
}

export interface BigExcelFetchResult<T> {
  rows: T[];
  /** 返回 true 表示已无更多数据（比 total 更可靠） */
  done?: boolean;
}

export type BigExcelFetcher<T> = (ctx: BigExcelFetchContext) => Promise<BigExcelFetchResult<T>>;

export interface ExportBigExcelOptions<T> {
  fileName: string;
  sheetName?: string;
  columns: ReadonlyArray<BigExcelColumn<T>>;
  fetcher: BigExcelFetcher<T>;
  chunkSize?: number;
  onProgress?: (progress: BigExcelProgress) => void;
  signal?: AbortSignal;
}
