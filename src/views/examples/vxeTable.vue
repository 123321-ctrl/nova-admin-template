<template>
  <div class="vxe-table-example">
    <NovaTable
      title="表格基础示例"
      v-model:page="query.page"
      v-model:limit="query.limit"
      :pageTotal="total"
      :config="nowConfig"
      :values="tableData"
    ></NovaTable>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import NovaTable from "@/components/NovaTable/index.vue";
defineOptions({
  name: "vxeTable",
});

let query = ref({
  page: 1,
  limit: 50,
});
let total = ref(0);

let nowConfig = [
  {
    label: "日期",
    prop: "date",
  },
  {
    label: "姓名",
    prop: "name",
  },
  {
    label: "地址",
    prop: "address",
  },
];

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>
<style lang="scss" scoped>
.vxe-table-example {
  box-sizing: border-box;
  height: 100%;
}
</style>
