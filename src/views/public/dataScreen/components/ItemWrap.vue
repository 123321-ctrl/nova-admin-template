<template>
  <BorderBox class="border-box-view">
    <div v-if="title" class="item_title">
      <div class="zuo" />
      <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
      <div class="you" />
    </div>
    <div :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
      <slot />
    </div>
  </BorderBox>
</template>
<script lang="ts" setup>
import BorderBox from './BorderBox.vue';
import type { PropType } from 'vue';

defineOptions({
  name: 'ItemWrap',
});

const props = defineProps({
  title: {
    type: [String] as PropType<string>,
    default: '',
  },
});
</script>
<style lang="scss" scoped>
.border-box-view {
  --item-title-height: 38px;
  --item_title_content-height: calc(100% - 38px);
  .item_title {
    height: var(--item-title-height);
    line-height: var(--item-title-height);
    width: 100%;
    color: #31abe3;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .zuo,
    .you {
      width: 58px;
      height: 14px;
      background-image: url(@/assets/images/zuo.png);
    }
    .you {
      transform: rotate(180deg);
    }
    .title-inner {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.85253906%, #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .item_title_content {
    height: var(--item_title_content-height);
  }

  .item_title_content_def {
    width: 100%;
    height: 100%;
  }
}
</style>
