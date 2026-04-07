<template>
  <ScaleScreen
    width="1920"
    height="1080"
    :delay="500"
    :box-style="{
      overflow: isScale ? 'hidden' : 'auto'
    }"
    :auto-scale="isScale">
    <div class="content_wrap">
      <Header />
      <div class="data-screen-box">
        <div class="content_left">
          <ItemWrap title="devices总览" class="item">
            <PieChart />
          </ItemWrap>
          <ItemWrap title="用户总览" class="item">
            <LineChart />
          </ItemWrap>
          <ItemWrap title="用户列表" class="item">
            <PieChart />
          </ItemWrap>
        </div>
        <div class="content_center">content_center</div>
        <div class="content_right">
          <ItemWrap title="次数" class="item">
            <PieChart />
          </ItemWrap>
          <ItemWrap title="排名" class="item">
            <PieChart />
          </ItemWrap>
          <ItemWrap title="统计图" class="item">
            <PieChart />
          </ItemWrap>
        </div>
      </div>
    </div>
  </ScaleScreen>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import ScaleScreen from "@/components/ScaleScreen/index.vue";
import Header from "./components/Header.vue";
import ItemWrap from "./components/ItemWrap.vue";

import PieChart from "./itemCom/PieChart.vue";
import LineChart from "./itemCom/LineChart.vue";
defineOptions({
  name: "DataScreen"
});

// 是否进行自动适配(默认分辨率1920*1080)
const isScale = ref(true);
</script>
<style lang="scss" scoped>
.content_wrap {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  background-image: url(@/assets/images/pageBg.png);
  background-size: cover;
  background-position: center center;
  .data-screen-box {
    width: 100%;
    display: flex;
    min-height: calc(100% - 64px);
    justify-content: space-between;
    color: #fff;
    .content_left,
    .content_right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 540px;
      box-sizing: border-box;
    }
    .content_center {
      flex: 1;
      margin: 0 54px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .item {
      height: 310px;
    }
  }
}
</style>
