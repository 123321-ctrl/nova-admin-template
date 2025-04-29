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
import { onActivated, ref } from "vue";
import NovaTable from "@/components/NovaTable/index.vue";
import { getListApi } from "@api/example/vxeTable/index";

defineOptions({
  name: "vxeTable",
});

const query = ref({
  page: 1,
  limit: 30,
});
const total = ref(0);
const tableData = ref();

const nowConfig = [
  {
    label: "姓名",
    prop: "name",
  },
  {
    label: "用户信息",
    props: ["name", "id"],
    separator: "-",
  },
  {
    label: "状态",
    prop: "status",
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
        label: "正常",
        value: 1,
        color: "#faad14",
      },
      {
        label: "冻结",
        value: 2,
        color: "red",
      },
    ],
  },
  {
    label: "LOGO",
    prop: "image",
    type: "images",
  },
  {
    label: "地址",
    prop: "address",
  },
  {
    label: "标签",
    prop: "tags",
    type: "tags",
    options: [
      {
        label: "标签1",
        value: 1,
        type: "primary",
      },
      {
        label: "标签2",
        value: 2,
        type: "info",
      },
      {
        label: "标签3",
        value: 3,
        type: "danger",
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
