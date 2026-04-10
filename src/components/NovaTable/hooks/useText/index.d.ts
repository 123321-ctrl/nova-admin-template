/**
 * @description: 配置项内容
 */
export interface Text {
  /**
   * @description: 单位(数组时为左右单位，字符串时为右单位)
   */
  unit?: string | string[];
  /**
   * @description: 分割符(props值不为空时有效)
   */
  separator?: string;
  /**
   * @description: props不为空时的方向 (column: 纵向排列 warp: 可换行 expand: 不省略文本)
   */
  cellClass?: '' | 'column' | 'warp' | 'expand';
  /**
   * @description: 枚举(对象)
   */
  map?: { [key: number | string]: Option | string };
  /**
   * @description: 标签内容格式器，支持字符串模板和回调函数两种形式 数据格式化 kilobit：千位分隔符
   */
  formatter?: 'kilobit';

  /**
   * @description: 保留小数点位数，formatter为kilobit时默认为2
   */
  toFixed?: number;
  /**
   * @description: 长显颜色(数组为针对props拼接字段的颜色，字符串为统一颜色)
   */
  color: string[];
}
