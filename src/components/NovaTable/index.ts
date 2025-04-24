export const props = {
  /**
   * @description: 标题
   * @return {*}
   */
  title: String,
  /**
   * @description: 是否为弹框表单
   */
  isDialog: Boolean,
  /**
   * @description: 表格类型
   */
  type: {
    type: String as () => "table" | "virtual" | "diy" | "descriptions",
    default: "table",
  },
  /**
   * @description: 默认数据
   */
  values: {
    type: Array,
    default: [],
  },
  /**
   * @description: 配置项
   */
  config: {
    type: Array,
    default: () => [],
  },
  /**
   * @description: 是否带边框
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * @description: 序号列
   */
  indexColumn: {
    type: Boolean,
    default: true,
  },
  /**
   * @description: 当前页数
   */
  page: Number,
  /**
   * @description: 每页条数
   */
  limit: Number,
  /**
   * @description: 总条数
   */
  pageTotal: Number,
  /**
   * @description: 其他分页配置
   */
  pagingConfig: {
    type: Object,
    default: {},
  },
  /**
   * @description: 文本为空时显示的文本
   * @return {*}
   */
  emptyValue: {
    type: String,
    default: "- -",
  },
};
