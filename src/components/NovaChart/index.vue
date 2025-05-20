<template>
  <div>
    <div ref="root" class="root">111</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, shallowRef, watch } from "vue";
import type { PropType } from "vue";
import type { Option, EChartsType } from "./types";

import { init as initChart, use } from "echarts/core";

import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components"; // 按需引入组件
import { CanvasRenderer } from "echarts/renderers"; // 按需选择渲染器

use([LineChart, GridComponent, CanvasRenderer]);

defineOptions({
  name: "NovaChart",
});

const root = shallowRef<HTMLElement>();
const chart = shallowRef<EChartsType>();

const props = defineProps({
  option: {
    type: Object as PropType<Option>,
    required: true,
  },
});

// watch(
//   () => props.option,
//   (option, oldOption) => {
//     if (!option) {
//       return;
//     }
//     if (!chart.value) {
//       init();
//     } else {
//       chart.value.setOption(option);
//     }
//   }
// );

onMounted(() => {
  init();
});

const init = () => {
  if (!root.value) {
    return;
  }
  chart.value = initChart(root.value);
  chart.value.setOption(props.option);
};
</script>
<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
}
</style>
