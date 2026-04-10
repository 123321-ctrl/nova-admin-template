import { defineStore } from 'pinia';
import { ref } from 'vue';
// import type { RouteRecordRaw } from "vue-router";
import { localSystems } from '@/router/modules/index';

export const useSystemStore = defineStore('system', () => {
  // 当前系统路由
  const systemRoutes = ref(localSystems);
  return { systemRoutes };
});
