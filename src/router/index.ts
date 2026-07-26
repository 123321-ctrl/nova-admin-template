import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { createRouter, createWebHashHistory } from 'vue-router';
import type { Router } from 'vue-router';

import publicRoutes from './modules/publicRoutes';
import { localRoutes } from './modules/index';
import { setSentryRouteContext } from '@/monitor/sentry';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...localRoutes],
});

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();
  next();
});

router.afterEach(async (to) => {
  NProgress.done();
  setSentryRouteContext({
    name: String(to.name ?? ''),
    path: to.path,
    title: String(to.meta.name ?? document.title),
  });
});

export default router as Router;
