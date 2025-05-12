<template>
  <div class="title_wrap">
    <div class="guang"></div>
    <div class="title">
      <div class="title-text">大屏可视化平台</div>
    </div>
    <div class="timer">2025-5-9</div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: "Header",
});
</script>
<style lang="scss" scoped>
.title_wrap {
  height: 60px;
  background-image: url(@/assets/images/top.png);
  background-size: cover;
  background-position: center center;
  position: relative;
  margin-bottom: 4px;
  .guang {
    width: 100%;
    height: 56px;
    position: absolute;
    bottom: -26px;
    background-image: url(@/assets/images/guang.png);
    background-position: 80px center;
  }
  .title {
    text-align: center;
    .title-text {
      display: inline-block;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.85253906%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .timer {
    position: absolute;
    right: 0;
    top: 30px;
    font-size: 18px;
    color: #fff;
  }
}
</style>
