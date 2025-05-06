import { Types } from "./hooks/index.d";

export interface ColumnItem extends Types {
  /**
   * @description: 标签
   */
  label?: string;
  /**
   * @description: key
   */
  // prop?: keyof T;
  prop?: string;
  /**
   * @description: key配置(多个)
   */
  props?: string[];
  /**
   * @description: 文本为空时显示的文本
   */
  emptyValue?: string;
  /**
   * @description: 数据筛选匹配（针对枚举)
   */
  options?: Option[];
  /**
   * @description: 枚举(对象)
   */
  map?: { [key: number | string]: Option | string };
}

/**
 * @description: 枚举类型
 */
export interface Option {
  /**
   * @description: 标签
   */
  label?: string;
  /**
   * @description: 值
   */
  value?: string | number;
  /**
   * @description: 颜色
   */
  color?: string;
}
