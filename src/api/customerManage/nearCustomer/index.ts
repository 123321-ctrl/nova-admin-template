import { createGet } from '@/utils/request';
import type { PagingParames, PagingResponse } from '@api/index.d';
import type { Customer } from './index.d';
/**
 * @description: 获取列表
 */
export const getCustomerList = createGet<PagingParames, PagingResponse<Customer[]>>(
  '/admin/nearCustomer/list',
);
