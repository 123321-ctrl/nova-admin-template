<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';

import { exportBigExcel } from '@utils/BigExcel';
import type { ExportBigExcelOptions } from '@utils/BigExcel';

defineOptions({
  name: 'BigExcelExport',
});

interface DemoRow {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
}

const form = ref({
  fileName: '大数据导出演示.xlsx',
  sheetName: 'Demo',
  totalRows: 120_000,
  chunkSize: 5000,
  simulateLatencyMs: 30,
});

const exporting = ref(false);
const writtenRows = ref(0);
const chunks = ref(0);
const controller = ref<AbortController | null>(null);

const percent = computed(() => {
  const total = Math.max(0, form.value.totalRows);
  if (total === 0) return 0;
  return Math.min(100, Math.floor((writtenRows.value / total) * 100));
});

const sleep = async (ms: number): Promise<void> => {
  if (ms <= 0) return;
  await new Promise<void>((resolve) => window.setTimeout(resolve, ms));
};

const buildRow = (id: number): DemoRow => {
  const phone = `138${String(id).padStart(8, '0')}`;
  return {
    id,
    name: `User ${id}`,
    phone,
    createdAt: new Date(Date.now() - id * 60_000),
  };
};

const startExport = async (): Promise<void> => {
  if (exporting.value) return;
  exporting.value = true;
  writtenRows.value = 0;
  chunks.value = 0;

  const ac = new AbortController();
  controller.value = ac;

  const columns: ExportBigExcelOptions<DemoRow>['columns'] = [
    { header: 'ID', key: 'id' },
    { header: '姓名', key: 'name' },
    { header: '手机号', key: 'phone' },
    { header: '创建时间', valueGetter: (r) => r.createdAt },
  ];

  try {
    await exportBigExcel<DemoRow>({
      fileName: form.value.fileName,
      sheetName: form.value.sheetName,
      chunkSize: form.value.chunkSize,
      columns,
      signal: ac.signal,
      fetcher: async ({ chunkIndex, chunkSize, signal }) => {
        if (signal?.aborted) return { rows: [], done: true };

        const total = Math.max(0, form.value.totalRows);
        const start = chunkIndex * chunkSize;
        if (start >= total) return { rows: [], done: true };

        const endExclusive = Math.min(start + chunkSize, total);
        const size = endExclusive - start;

        await sleep(form.value.simulateLatencyMs);
        const rows: DemoRow[] = new Array(size);
        for (let i = 0; i < size; i += 1) {
          rows[i] = buildRow(start + i + 1);
        }

        return { rows, done: endExclusive >= total };
      },
      onProgress: (p) => {
        writtenRows.value = p.writtenRows;
        chunks.value = p.chunks;
      },
    });

    ElMessage.success('导出任务已完成，文件已下载。');
  } catch (err) {
    const message = err instanceof Error ? err.message : '导出失败';
    ElMessage.error(message);
  } finally {
    exporting.value = false;
    controller.value = null;
  }
};

const cancelExport = (): void => {
  controller.value?.abort();
  ElMessage.info('已取消导出。');
};
</script>

<template>
  <div class="big-excel-export">
    <el-card class="card" shadow="never">
      <template #header>
        <div class="header">
          <div class="title">大数据量导出 Excel（Worker + 分片）</div>
          <div class="sub">主线程分片拉取，Worker 拼装 xlsx，避免 UI 卡死</div>
        </div>
      </template>

      <el-form label-width="120px" class="form">
        <el-form-item label="文件名">
          <el-input v-model="form.fileName" placeholder="例如：用户列表.xlsx" />
        </el-form-item>
        <el-form-item label="Sheet 名称">
          <el-input v-model="form.sheetName" placeholder="例如：Users" />
        </el-form-item>
        <el-form-item label="总行数（演示）">
          <el-input-number v-model="form.totalRows" :min="0" :step="1000" />
        </el-form-item>
        <el-form-item label="分片大小">
          <el-input-number v-model="form.chunkSize" :min="100" :step="500" />
        </el-form-item>
        <el-form-item label="模拟延迟(ms)">
          <el-input-number v-model="form.simulateLatencyMs" :min="0" :step="10" />
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-button type="primary" :disabled="exporting" @click="startExport"> 开始导出 </el-button>
        <el-button :disabled="!exporting" @click="cancelExport"> 取消 </el-button>
      </div>

      <el-divider />

      <div class="progress">
        <el-progress :percentage="percent" :stroke-width="14" />
        <div class="progress-meta">
          <div>已写入行数：{{ writtenRows }}</div>
          <div>已处理分片：{{ chunks }}</div>
        </div>
      </div>

      <el-alert
        class="tips"
        type="info"
        show-icon
        :closable="false"
        title="接入真实接口时，把 fetcher 改成分页请求即可（page=chunkIndex+1, pageSize=chunkSize）。"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.big-excel-export {
  box-sizing: border-box;
  height: 100%;
  padding: 12px;
}

.card {
  height: 100%;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.sub {
  font-size: 12px;
  opacity: 0.8;
}

.form {
  max-width: 720px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-meta {
  display: flex;
  gap: 18px;
  font-size: 12px;
  opacity: 0.9;
}

.tips {
  margin-top: 12px;
}
</style>
