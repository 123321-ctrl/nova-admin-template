import { h, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMenu, ElMenuItem, ElSubMenu, ElMenuItemGroup } from "element-plus";

export const useSidebar = (context: any) => {
  const { props, emit } = context;
  const route = useRoute();
  const isCollapse = ref(false);

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  // 渲染 Logo
  const renderLogo = () => {
    return h("div", { class: "nova-logo-container" }, [
      h("img", { src: props.config.logo, class: "logo-img" }),
      h("div", { class: "logo-title" }, props.config.title),
    ]);
  };

  const isHasChildren = ({ children }: any) => {
    return (
      children &&
      children.length &&
      children.some((item: any) => !item.meta.hidden)
    );
  };

  const menuItem = (item: any, level: number = 0) => {
    level++;
    const {
      path,
      meta: { hidden, name },
      children,
    } = item;
    if (isHasChildren(item)) {
      return h(
        ElSubMenu,
        { index: path, class: `level-${level}` },
        {
          default: () =>
            h(ElMenuItemGroup, null, {
              default: () => children.map((item: any) => menuItem(item, level)),
              title: () => name,
            }),
          title: () => h("div", {}, name),
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
        },
      },
      () => h("div", {}, name)
    );
  };

  // 渲染菜单
  const renderMenu = () => {
    return h(
      ElMenu,
      {
        collapse: isCollapse.value,
        defaultActive: route.path,
      },
      () => props.routes.map((item: any) => menuItem(item))
    );
  };

  // 渲染侧边栏
  const render = () => {
    return h(
      "div",
      {
        class: ["nova-layout-aside", { "is-collapse": isCollapse.value }],
        style: { width: "200px" },
      },
      [renderLogo(), renderMenu()]
    );
  };

  return {
    isCollapse,
    toggleCollapse,
    render,
  };
};
