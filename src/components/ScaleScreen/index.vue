<template>
  <section class="v-screen-box" :style="{ ...boxStyle }">
    <div ref="screenWrapper" class="screen-wrapper">
      <slot />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
import type { PropType, CSSProperties } from "vue";

interface IState {
  width?: string | number;
  height?: string | number;
}

defineOptions({
  name: "ScaleScreen"
});

const props = defineProps({
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 1920
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 1080
  },
  delay: {
    type: Number as PropType<number>,
    default: 500
  },
  boxStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  autoScale: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  fullScreen: {
    type: Boolean as PropType<boolean>,
    default: false
  }
});

const screenWrapper = ref<HTMLElement>();
const state = ref<IState>({
  width: 0,
  height: 0
});

/**
 * 防抖函数
 * @param {Function} fn
 * @param {number} delay
 * @returns {() => void}
 */
function debounce(fn: Function, delay: number): () => void {
  let timer: any;
  return function (...args: any[]): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      () => {
        typeof fn === "function" && fn.apply(null, args);
        clearTimeout(timer);
      },
      delay > 0 ? delay : 100
    );
  };
}

// const initMutationObserver = () => {
//   const observer = (state.observer = new MutationObserver(() => {
//     onResize();
//   }));
//   observer.observe(screenWrapper.value!, {
//     attributes: true,
//     attributeFilter: ["style"],
//     attributeOldValue: true,
//   });
// };

const addListener = () => {
  window.addEventListener("resize", onResize);
  // initMutationObserver();
};

const clearListener = () => {
  window.removeEventListener("resize", onResize);
  // state.observer?.disconnect();
};

const onResize = debounce(async () => {
  updateScale();
}, props.delay);

onMounted(() => {
  initSize();
  updateSize();
  updateScale();
  addListener();
});

onUnmounted(() => {
  clearListener();
});
/**
 * 初始化大屏容器宽高
 */
const initSize = () => {
  if (props.width && props.height) {
    state.value.width = props.width;
    state.value.height = props.height;
  }
};

/**
 * 更新大屏容器宽高
 */
const updateSize = () => {
  if (state.value.width && state.value.height) {
    screenWrapper.value!.style.width = `${state.value.width}px`;
    screenWrapper.value!.style.height = `${state.value.height}px`;
  }
};

const updateScale = () => {
  // 获取真实视口尺寸
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;

  // 获取大屏最终的宽高
  const realWidth = state.value.width;
  const realHeight = state.value.height;

  // 计算缩放比例
  const widthScale = currentWidth / +realWidth!;
  const heightScale = currentHeight / +realHeight!;

  // 若要铺满全屏，则按照各自比例缩放
  if (props.fullScreen) {
    screenWrapper.value!.style.transform = `scale(${widthScale},${heightScale})`;
    return;
  }

  // 按照宽高最小比例进行缩放
  const scale = Math.min(widthScale, heightScale);
  autoScale(scale);
};

const autoScale = (scale: number) => {
  if (!props.autoScale) {
    return;
  }
  const domWidth = screenWrapper.value!.clientWidth;
  const domHeight = screenWrapper.value!.clientHeight;
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;

  screenWrapper.value!.style.transform = `scale(${scale},${scale})`;

  let mx = Math.max((currentWidth - domWidth * scale) / 2, 0);
  let my = Math.max((currentHeight - domHeight * scale) / 2, 0);

  screenWrapper.value!.style.margin = `${my}px ${mx}px`;
};
</script>
<style lang="scss" scoped>
.v-screen-box {
  background: rgb(3, 5, 12);
  width: 100vw;
  height: 100vh;
  .screen-wrapper {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    transform-origin: left top;
  }
}
</style>
