import { createApp } from 'vue';

import { setupStore } from '@/store';
import 'virtual:svg-icons-register';
import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';

import './assets/styles/global.scss';
import './assets/styles/root.scss';

import versionChecker from '@/utils/versionChecker';

// 模拟数据
import '@api/mocks';

const app = createApp(App);

setupStore(app);

app.use(router);
app.mount('#app');

// 初始化版本更新检测
versionChecker.init(true, 1 * 60 * 1000); // 15分钟间隔
