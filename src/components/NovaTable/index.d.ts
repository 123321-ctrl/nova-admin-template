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
   * @description: 类型
   */
  type?: "primary" | "success" | "info" | "warning" | "danger";
}
