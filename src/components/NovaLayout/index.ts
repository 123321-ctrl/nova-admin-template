import type { PropType } from "vue";
import type { RouteRecordRaw } from "vue-router";

export const props = {
  /**
   * @description: 布局方式
   */
  layout: {
    type: String as () => "default" | "left" | "top",
    default: "default",
  },
  routes: {
    type: Array as PropType<RouteRecordRaw[]>,
    required: true,
  },
  /**
   * @description: 基本信息配置
   */
  config: Object,
};
