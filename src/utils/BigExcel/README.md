# BigExcel（Worker + 分片导出 xlsx）

目标：在**主线程**只负责“分片拉数据 + 触发下载”，把“拼装/写入 xlsx”放到 **Web Worker**，避免大数据量导出时 UI 卡死。

## 快速使用

```ts
import { exportBigExcel } from '@utils/BigExcel';

interface UserRow {
  id: number;
  name: string;
  phone: string;
}

await exportBigExcel<UserRow>({
  fileName: '用户列表.xlsx',
  sheetName: 'Users',
  chunkSize: 5000,
  columns: [
    { header: 'ID', key: 'id' },
    { header: '姓名', key: 'name' },
    { header: '手机号', key: 'phone' },
  ],
  fetcher: async ({ chunkIndex, chunkSize, signal }) => {
    // 你可以在这里调用接口：page = chunkIndex + 1, pageSize = chunkSize
    // signal 用于中断请求（如果你的请求库支持）
    const rows: UserRow[] = await mockFetchUsers(chunkIndex, chunkSize, signal);
    return { rows, done: rows.length < chunkSize };
  },
  onProgress: (p) => {
    console.log('已写入行数', p.writtenRows, '分片', p.chunks);
  },
});

async function mockFetchUsers(chunkIndex: number, chunkSize: number, _signal?: AbortSignal): Promise<UserRow[]> {
  const start = chunkIndex * chunkSize;
  const end = start + chunkSize;
  const total = 120_000;
  if (start >= total) return [];
  const realEnd = Math.min(end, total);
  return Array.from({ length: realEnd - start }).map((_, i) => {
    const id = start + i + 1;
    return { id, name: `User ${id}`, phone: `1380000${String(id).padStart(4, '0')}` };
  });
}
```

## 取消导出

```ts
import { exportBigExcel } from '@utils/BigExcel';

const ac = new AbortController();
const p = exportBigExcel({ /* ... */ signal: ac.signal });
ac.abort(); // 立刻取消并终止 worker
await p;
```

## 设计要点

- **Worker 端增量写入**：每次只 append 一片数据到 sheet（`sheet_add_aoa`），最后一次性 `write` 输出 ArrayBuffer。
- **分片 fetcher**：导出逻辑不关心数据来源，调用端只需要实现 `fetcher`。
- **进度回调**：以已写入行数为主（更接近用户感知）。

