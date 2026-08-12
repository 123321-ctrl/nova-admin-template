import { createApp } from 'vue';

import { setupStore } from '@/store';
import 'virtual:svg-icons-register';
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';

import './assets/styles/global.scss';
import './assets/styles/root.scss';
import { createSentryRuntimeConfig } from '@/monitor/config';
import { initSentry } from '@/monitor/sentry';

// import versionChecker from '@/utils/versionChecker';

// 模拟数据
import '@api/mocks';

const app = createApp(App);

initSentry(
  app,
  createSentryRuntimeConfig({
    enabled: import.meta.env.VITE_SENTRY_ENABLED ?? '',
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? '',
    dsn: import.meta.env.VITE_SENTRY_DSN ?? '',
    appVersion: __APP_VERSION__,
  }),
);

setupStore(app);

app.use(router);
app.mount('#app');

app.config.errorHandler = (err, instance, info) => {
  console.log('errorHandler111', err, instance, info);
};

// 初始化版本更新检测
// versionChecker.init(true, 1 * 60 * 1000); // 15分钟间隔
