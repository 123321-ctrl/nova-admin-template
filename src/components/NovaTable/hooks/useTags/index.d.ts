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
