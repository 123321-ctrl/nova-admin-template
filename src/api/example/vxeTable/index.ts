import { createGet } from "@/utils/request";
import type { PagingParames, PagingResponse } from "@api/index.d";
import type { EItem } from "./index.d";
/**
 * @description: 获取列表
 */
export const getListApi = createGet<PagingParames, PagingResponse<EItem[]>>(
  "/admin/example/list"
);
