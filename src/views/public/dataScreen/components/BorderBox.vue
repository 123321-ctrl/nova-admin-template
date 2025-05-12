<template>
  <div class="border-box" ref="domRef">
    <svg
      data-v-11aeef05=""
      class="svg-container"
      :width="width"
      :height="height"
    >
      <path
        data-v-11aeef05=""
        :fill="backgroundColor"
        stroke="#6586ec"
        :d="`
            M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
            L ${width - 20} 10 L ${width - 5} 25
            L ${width - 5} ${height - 5} L 20 ${height - 5}
            L 5 ${height - 20} L 5 20
        `"
      ></path>
      <path
        fill="transparent"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="10, 5"
        stroke="#6586ec"
        d="M 16 9 L 61 9"
      ></path>
      <path
        fill="transparent"
        stroke="{mergedColor[1]}"
        d="M 5 20 L 5 10 L 12 3  L 60 3 L 68 10"
      ></path>
      <path
        fill="transparent"
        stroke="#2cf7fe"
        :d="`M ${width - 5} ${height - 30} L ${width - 5} ${height - 5} L ${
          width - 30
        } ${height - 5}`"
      ></path>
    </svg>
    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import type { PropType } from "vue";

defineOptions({
  name: "BorderBox",
});

const props = defineProps({
  backgroundColor: {
    type: String as PropType<string>,
    default: "transparent",
  },
});

const domRef = ref(null);
const { width, height } = useElementSize(domRef, { width: 0, height: 0 });
</script>
<style lang="scss" scoped>
.border-box {
  position: relative;
  .svg-container {
    position: absolute;
  }
  .border-box-content {
    box-sizing: border-box;
    padding: 6px 16px 0px;
  }
}
</style>
