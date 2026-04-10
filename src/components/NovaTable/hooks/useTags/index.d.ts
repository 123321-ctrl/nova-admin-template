import { Option as MainOption } from '../../index.d';

/**
 * @description: 配置项内容
 */
export interface Tags {
  /**
   * @description: 名称(默认为label)
   */
  labelKey?: string;
  /**
   * @description: 类型的其他element属性
   */
  attrs?: { [key: string]: any };
}

/**
 * @description: 文件类型
 */
export interface ValueTypes {
  /**
   * @description: 标签
   */
  label: string;
  /**
   * @description: 值
   */
  value: string;
  /**
   * @description: 其他自定义属性
   */
  [key: string]: string;
}

/**
 * @description: 枚举类型
 */
export interface Option extends MainOption {
  /**
   * @description: 类型
   */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}
