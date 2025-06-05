<template>
  <div>
    <div ref="root" class="root">111</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, shallowRef, watch, toRefs } from "vue";
import type { PropType } from "vue";
import type { Option, EChartsType, AutoResize } from "./types";
import { useAutoresize } from "./hooks/autoresize";

import { init as initChart, use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components"; // 按需引入组件
import { CanvasRenderer } from "echarts/renderers"; // 按需选择渲染器
use([
  LineChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  TitleComponent,
]);

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
  autoresize: {
    type: Object as PropType<AutoResize>,
    default: () => ({}),
  },
});
const { autoresize } = toRefs(props);
watch(
  () => props.option,
  (option, oldOption) => {
    if (!option) {
      return;
    }
    if (!chart.value) {
      init();
    } else {
      chart.value.setOption(option);
    }
  }
);

useAutoresize(chart, autoresize, root);

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
