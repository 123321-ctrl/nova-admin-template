<template>
  <main class="sentry-poc">
    <header class="sentry-poc__header">
      <div>
        <h1>Sentry POC</h1>
        <p>测试环境异常定位验收</p>
      </div>
      <!-- prettier-ignore -->
      <el-tag
        type="warning"
        effect="plain"
      >
        test only
      </el-tag>
    </header>

    <section class="sentry-poc__panel">
      <h2>自动捕获</h2>
      <div class="sentry-poc__actions">
        <!-- prettier-ignore -->
        <el-button
          type="danger"
          @click="triggerRuntimeError"
        >
          JS 运行时异常
        </el-button>
        <!-- prettier-ignore -->
        <el-button
          type="danger"
          @click="triggerPromiseError"
        >
          Promise 异常
        </el-button>
        <!-- prettier-ignore -->
        <el-button
          type="danger"
          @click="triggerLifecycleError"
        >
          Vue 生命周期异常
        </el-button>
      </div>
    </section>

    <section class="sentry-poc__panel">
      <h2>主动捕获</h2>
      <div class="sentry-poc__actions">
        <!-- prettier-ignore -->
        <el-button
          type="primary"
          @click="triggerManualCapture"
        >
          手动捕获
        </el-button>
        <!-- prettier-ignore -->
        <el-button
          type="primary"
          @click="triggerContextValidation"
        >
          上下文验证
        </el-button>
      </div>
    </section>

    <!-- prettier-ignore -->
    <LifecycleErrorProbe
      v-if="lifecycleProbeVisible"
      :key="lifecycleProbeKey"
    />
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h, nextTick, onMounted, ref } from 'vue';

import { capturePocException, setPocTestCase } from '@/monitor/sentry';

const lifecycleProbeVisible = ref(false);
const lifecycleProbeKey = ref(0);

const LifecycleErrorProbe = defineComponent({
  name: 'LifecycleErrorProbe',
  setup() {
    onMounted(() => {
      throw new Error('Sentry POC Vue lifecycle error');
    });

    return () => h('span', { hidden: true });
  },
});

function triggerRuntimeError() {
  setPocTestCase('js-runtime');
  const invalidTarget = {} as { updateFrom: () => void };
  invalidTarget.updateFrom();
  console.log('111');
}

function triggerPromiseError() {
  setPocTestCase('unhandled-promise');
  void Promise.reject(new Error('Sentry POC unhandled promise rejection'));
}

async function triggerLifecycleError() {
  setPocTestCase('vue-lifecycle');
  lifecycleProbeVisible.value = false;
  await nextTick();
  lifecycleProbeKey.value += 1;
  lifecycleProbeVisible.value = true;
}

function triggerManualCapture() {
  capturePocException(new Error('Sentry POC manual capture'), 'manual-capture');
}

function triggerContextValidation() {
  capturePocException(new Error('Sentry POC context validation'), 'context-validation');
}

window.addEventListener(
  'error',
  (event) => {
    console.log('error', event.message);
    console.log(event.filename);
    console.log(event.lineno);
    console.log(event.colno);
    console.log(event.error);
  },
  true,
);

window.addEventListener('unhandledrejection', (event) => {
  console.log(event.reason);
});
</script>

<style scoped lang="scss">
.sentry-poc {
  min-height: 100%;
  padding: 24px;
  color: #1f2937;
  background: #f5f7fa;
}

.sentry-poc__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 960px;
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: 24px;
    line-height: 1.3;
  }

  p {
    margin: 0;
    color: #606266;
  }
}

.sentry-poc__panel {
  max-width: 960px;
  padding: 20px;
  margin-bottom: 16px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;

  h2 {
    margin: 0 0 16px;
    font-size: 16px;
    line-height: 1.4;
  }
}

.sentry-poc__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .sentry-poc {
    padding: 16px;
  }

  .sentry-poc__header {
    gap: 16px;
  }

  .sentry-poc__actions {
    flex-direction: column;
  }

  :deep(.el-button) {
    width: 100%;
  }
}
</style>
