import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { createRouter, createWebHistory } from 'vue-router';
import type { Router } from 'vue-router';

import publicRoutes from './modules/publicRoutes';
import { localRoutes } from './modules/index';
import { restoreGitHubPagesRoute } from './githubPagesFallback';
import { setSentryRouteContext } from '@/monitor/sentry';

restoreGitHubPagesRoute();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
