<template>
  <NovaChart class="chart" :option="option" />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import NovaChart from "@/components/NovaChart/index.vue";

import { use } from "echarts/core";
import { LineChart } from "echarts/charts";

use([LineChart]);

defineOptions({
  name: "LineChart",
});

const option = ref({
  title: {
    text: "示例图表",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
});
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
