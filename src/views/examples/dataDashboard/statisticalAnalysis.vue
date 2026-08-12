<template>
  <div class="analysis-view">
    <div
      v-if="showLcpBlock"
      class="lcp-block"
    >
      运营后台核心数据看板
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'StatisticalAnalysis',
});

const showLcpBlock = ref(false);

onMounted(() => {
  setTimeout(() => {
    showLcpBlock.value = true;
  }, 4000);
});
</script>

<style lang="scss" scoped>
.analysis-view {
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fa;
}

.lcp-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 320px;
  margin-top: 40px;
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}
</style>
