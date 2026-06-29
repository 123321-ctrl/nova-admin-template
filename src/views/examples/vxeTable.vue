<template>
  <div class="vxe-table-example">
    <!-- <NovaTable
      v-model:page="query.page"
      v-model:limit="query.limit"
      title="表格基础示例"
      :page-total="total"
      :config="nowConfig"
      :values="tableData"
    /> -->
    <NovaTable2 :config="tableConfig" :data="tableData1" row-key="id" />
  </div>
</template>
<script lang="ts" setup>
import { onActivated, ref, computed } from 'vue';
import NovaTable from '@/components/NovaTable/index.vue';
import { getListApi } from '@api/example/vxeTable/index';

import {
  NovaTable as NovaTable2,
  type NovaTableColumnConfig,
  type NovaTableRow,
} from '@123321-ctrl/ui';

defineOptions({
  name: 'VxeTable',
});

const query = ref({
  page: 1,
  limit: 30,
});
const total = ref(0);
const tableData = ref();

const tableConfig: NovaTableColumnConfig[] = [
  {
    label: '渠道ID',
    prop: 'id',
    minWidth: 100,
  },
  {
    label: '渠道名称',
    prop: 'channelName',
    minWidth: 160,
  },
  {
    label: '渠道状态',
    prop: 'status',
    type: 'enum',
    minWidth: 120,
    options: [
      {
        label: '启用',
        value: 1,
      },
      {
        label: '停用',
        value: 0,
      },
    ],
  },
  {
    label: '负责人',
    prop: 'owner',
    minWidth: 120,
  },
  {
    label: '更新时间',
    prop: 'updatedAt',
    minWidth: 180,
  },
];
const tableData1 = ref<NovaTableRow[]>([
  {
    id: 10001,
    channelName: '官网渠道',
    status: 1,
    owner: '运营一组',
    updatedAt: '2026-06-28 09:30',
  },
  {
    id: 10002,
    channelName: '小程序渠道',
    status: 1,
    owner: '增长团队',
    updatedAt: '2026-06-28 10:15',
  },
  {
    id: 10003,
    channelName: '线下门店',
    status: 0,
    owner: '渠道团队',
    updatedAt: '2026-06-27 18:20',
  },
]);

const nowConfig = [
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '联系电话',
    prop: 'contactPhone',
    formatter: '{@contactPhone} | ID: {@id}',
  },
  {
    label: '用户信息',
    props: ['name', 'id'],
    separator: '-',
  },
  {
    label: '金额',
    prop: 'money',
    unit: ['$'],
    formatter: 'kilobit',
  },
  {
    label: '钱数区间',
    props: ['money', 'money2'],
    unit: ['$'],
    formatter: 'kilobit',
    separator: '-',
  },
  {
    label: '区间',
    prop: 'tagsTest',
    separator: '-',
  },
  {
    label: '区间',
    props: ['money', 'money2'],
    cellClass: 'column',
    color: ['red', 'blue'],
  },
  {
    label: '状态',
    prop: 'status',
    // 写法1
    // map: {
    //   1: "正常",
    //   2: "冻结",
    // },
    // 写法2
    // map: {
    //   1: {
    //     label: "正常",
    //     color: "#faad14",
    //   },
    //   2: {
    //     label: "冻结",
    //     color: "red",
    //   },
    // },
    // 写法3
    options: [
      {
        label: '正常',
        value: 1,
        color: '#faad14',
      },
      {
        label: '冻结',
        value: 2,
        color: 'red',
      },
    ],
  },
  {
    label: 'LOGO',
    prop: 'image',
    type: 'images',
  },
  {
    label: '地址',
    prop: 'address',
  },
  {
    label: '标签',
    prop: 'tags',
    type: 'tags',
    options: [
      {
        label: '标签1',
        value: 1,
        type: 'primary',
      },
      {
        label: '标签2',
        value: 2,
        type: 'info',
      },
      {
        label: '标签3',
        value: 3,
        type: 'danger',
      },
    ],
  },
];

onActivated(() => {
  getList();
});

const getList = async () => {
  try {
    const {
      data: { list, count },
    } = await getListApi(query.value);
    tableData.value = list;
    total.value = count;
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.vxe-table-example {
  box-sizing: border-box;
  height: 100%;
}
</style>
