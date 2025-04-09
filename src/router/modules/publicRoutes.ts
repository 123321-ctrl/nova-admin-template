import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/public/login.vue"),
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/public/redirect.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/public/404.vue"),
      },
    ],
  },
];

export default publicRoutes;
