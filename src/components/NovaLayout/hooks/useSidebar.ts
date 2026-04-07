import { h, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMenu, ElMenuItem, ElSubMenu, ElMenuItemGroup, ElScrollbar } from "element-plus";
import { useSymbol } from "@/hooks/useSymbol";

export const useSidebar = (context: any) => {
  const { props, emit, isCollapse } = context;
  const route = useRoute();

  // 渲染 Logo
  const logoView = () => {
    return h("div", { class: "nova-logo-container" }, [
      h("img", { src: props.config.logo, class: "logo-img" }),
      !isCollapse.value && h("div", { class: "logo-title" }, props.config.title)
    ]);
  };

  const content = ({ meta: { name, icon } }: any) => {
    return [icon && h("div", { class: "menu-icon" }, useSymbol(icon)), h("div", { class: "menu-name" }, name)];
  };

  const isHasChildren = ({ children }: any) => {
    return children && children.length && children.some((item: any) => !item.meta.hidden);
  };

  const menuItem = (item: any, level: number = 0) => {
    level++;
    const {
      path,
      meta: { hidden, name },
      children
    } = item;

    if (hidden) return;
    if (isHasChildren(item)) {
      return h(
        ElSubMenu,
        { index: path, class: `level-${level}` },
        {
          default: () =>
            h(ElMenuItemGroup, null, {
              default: () => children.map((item: any) => menuItem(item, level)),
              title: () => name
            }),
          title: () => content(item)
        }
      );
    }
    return h(
      ElMenuItem,
      {
        index: path,
        class: `level-${level}`,
        onClick: () => {
          emit("selectMenu", item);
        }
      },
      () => content(item)
    );
  };

  // 渲染菜单
  const menubar = () => {
    return h(
      "div",
      { class: "nova-layout-menubar" },
      h(ElScrollbar, { class: "xc-layout-menubar-scrollbar" }, () =>
        h(
          ElMenu,
          {
            collapse: isCollapse.value,
            defaultActive: route.path
          },
          () => props.routes.map((item: any) => menuItem(item))
        )
      )
    );
  };

  return {
    render: () => {
      return h(
        "div",
        {
          class: ["nova-layout-asidebar", { "is-collapse": isCollapse.value }]
        },
        [logoView(), menubar()]
      );
    }
  };
};
