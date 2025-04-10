import type { RouteRecordRaw } from "vue-router";

const examplesRoutes: RouteRecordRaw = {
  path: "/",
  component: () => import("@/layout/index.vue"),
  name: "Layout",
  redirect: "/examples/vxe-table",
  children: [
    {
      path: "/examples/dataDashboard",
      name: "DataDashboard",
      meta: {
        name: "数据看板",
        icon: "menu-overview",
      },
      redirect: "/examples/dataDashboard/statisticalAnalysis",
      children: [
        {
          path: "/examples/dataDashboard/statisticalAnalysis",
          name: "StatisticalAnalysis",
          meta: {
            name: "统计分析",
          },
          component: () =>
            import("@views/examples/dataDashboard/statisticalAnalysis.vue"),
        },
        {
          path: "/examples/dataDashboard/cycleKanban",
          name: "CycleKanban",
          meta: {
            name: "周期看板",
          },
          component: () =>
            import("@views/examples/dataDashboard/statisticalAnalysis.vue"),
        },
      ],
    },
    {
      path: "/examples/vxe-table",
      name: "VxeTable",
      meta: {
        name: "表格基础示例",
        icon: "menu-overview",
      },
      component: () => import("@views/examples/vxeTable.vue"),
    },
  ],
};
export default examplesRoutes;
