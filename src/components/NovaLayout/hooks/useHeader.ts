import { h, computed } from "vue";
import { useRoute } from "vue-router";
import { useSidebar } from "./useSidebar";

export function useHeader(context: any) {
  const route = useRoute();

  // 渲染用户信息
  const UserInfo = () => {
    return h("div", { class: "user-info" }, [
      h(
        "el-dropdown",
        {
          trigger: "click",
        },
        [h("span", {}, "111"), h("span", {}, "222")]
      ),
    ]);
  };

  // 渲染右侧工具栏
  const Toolbar = () => {
    return h("div", { class: "toolbar" }, [
      h(
        "el-tooltip",
        {
          content: "全屏",
          placement: "bottom",
        },
        [h("el-icon", { class: "toolbar-icon" }, [h("full-screen")])]
      ),
      h(
        "el-tooltip",
        {
          content: "主题设置",
          placement: "bottom",
        },
        [h("el-icon", { class: "toolbar-icon" }, [h("setting")])]
      ),
    ]);
  };

  return {
    render: () => {
      return h("div", { class: "nova-layout-header" }, [
        // 左侧区域
        h("div", { class: "nova-header-left" }, "left"),
        // 右侧区域
        h("div", { class: "nova-header-right" }, [Toolbar(), UserInfo()]),
      ]);
    },
  };
}
