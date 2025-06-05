<template>
  <div class="layout-view">
    <!-- <NovaLayout :layout="'vertical'" /> -->
    <NovaLayout :config="config" :routes="routes" @selectMenu="selectMenu">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </NovaLayout>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.svg";
import { computed } from "vue";
import NovaLayout from "@/components/NovaLayout/index.vue";

import { useSystemStore } from "@/store/modules/stsyem";
const systemStore = useSystemStore();

import { useRouter } from "vue-router";
const router = useRouter();
/**
 * @description: 配置信息
 */
let config = computed(() => {
  return {
    logo,
    title: "Nova Admin",
  };
});

// 获取路由表
const routes = computed(() => {
  return (systemStore.systemRoutes[0] as any)?.children;
});

/**
 * @description: 选择菜单
 */
let selectMenu = (menu: any) => {
  router.push(menu.path);
};
</script>

<style scoped lang="scss">
.layout-view {
  height: 100%;
}
</style>
