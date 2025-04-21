/**
 * @description: 公共分页回执
 */
export interface PagingResponse<T> {
  count: number;
  limit: number;
  pageCount: number;
  page: number;
  list: T;
}

/**
 * @description: 公共分页传参
 */
export interface PagingParames {
  page: number | string;
  limit: number | string;
}

/**
 * @description: 接口默认回执
 */
export type Response<T> = {
  code: number;
  msg: string;
  data: T;
};
