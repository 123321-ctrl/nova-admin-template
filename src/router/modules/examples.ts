import type { RouteRecordRaw } from "vue-router";

const examplesRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/examples/vxe-table",
    children: [
      {
        path: "/examples/dataDashboard",
        meta: {
          name: "数据看板",
        },
        children: [
          {
            path: "/examples/dataDashboard/statisticalAnalysis",
            meta: {
              name: "统计分析",
            },
            component: () =>
              import("@views/examples/dataDashboard/statisticalAnalysis.vue"),
          },
          {
            path: "/examples/dataDashboard/statisticalAnalysis1",
            meta: {
              name: "统计分析1",
            },
            component: () =>
              import("@views/examples/dataDashboard/statisticalAnalysis.vue"),
          },
        ],
      },
      {
        path: "/examples/vxe-table",
        meta: {
          name: "表格基础示例",
        },
        component: () => import("@views/examples/vxeTable.vue"),
      },
    ],
  },
];
export default examplesRoutes;
