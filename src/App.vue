<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue';

// 注入svg图标前缀
provide('iconPrefix', 'i');
</script>

<style scoped></style>
