import { h } from "vue";
import shrink from "../images/shrink.svg?raw";

export function useHeader(context: any) {
  const { props, isCollapse } = context;

  /**
   * @description: 侧边栏缩放切换
   * @return {*}
   */
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  // 渲染用户信息
  const UserInfo = () => {
    return h("div", { class: "user-info" }, [
      h(
        "el-dropdown",
        {
          trigger: "click"
        },
        [h("span", {}, "111"), h("span", {}, "222")]
      )
    ]);
  };

  // 渲染右侧工具栏
  const Toolbar = () => {
    return h("div", { class: "toolbar" }, [
      h(
        "el-tooltip",
        {
          content: "全屏",
          placement: "bottom"
        },
        [h("el-icon", { class: "toolbar-icon" }, [h("full-screen")])]
      ),
      h(
        "el-tooltip",
        {
          content: "主题设置",
          placement: "bottom"
        },
        [h("el-icon", { class: "toolbar-icon" }, [h("setting")])]
      )
    ]);
  };

  return {
    render: () => {
      return h("div", { class: "nova-layout-header" }, [
        h("div", { class: "nova-layout-header-main" }, [
          // 左侧区域
          h("div", { class: "nova-layout-header-left" }, [
            props.layout === "default" &&
              h("div", {
                class: ["nova-layout-header-collapse", { shrink: isCollapse.value }],
                onClick: toggleCollapse,
                innerHTML: shrink
              })
          ]),
          // 右侧区域
          h("div", { class: "nova-layout-header-right" }, [Toolbar(), UserInfo()])
        ])
      ]);
    }
  };
}
