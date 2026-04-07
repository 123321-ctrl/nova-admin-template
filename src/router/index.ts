import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";

import publicRoutes from "./modules/publicRoutes";
import { localRoutes } from "./modules/index";

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...localRoutes]
});

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();
  next();
});

router.afterEach(async (_to) => {
  NProgress.done();
});

export default router as Router;
