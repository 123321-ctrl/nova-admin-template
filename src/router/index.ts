import { createRouter, createWebHistory } from "vue-router";
import type { Router } from "vue-router";

import publicRoutes from "./modules/publicRoutes";
import { localRoutes } from "./modules/index";

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...localRoutes],
});

export default router as Router;
