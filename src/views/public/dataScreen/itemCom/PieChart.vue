<template>
  <NovaChart class="chart" :option="option" autoresize />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import NovaChart from '@/components/NovaChart/index.vue';

import { use, graphic } from 'echarts/core';
import { PieChart } from 'echarts/charts';
use([PieChart]);

defineOptions({
  name: 'PieChart',
});

let colors = ['#0BFC7F', '#A0A0A0', '#F48C02', '#F4023C'];
const data = ref();
const option = ref();

const echartsGraphic = (colors: string[]) => {
  // 使用 ECharts 的 graphic.LinearGradient 创建一个线性渐变对象
  return new graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: colors[0] },
    { offset: 1, color: colors[1] },
  ]);
};

const setOption = () => {
  option.value = {
    title: {
      top: 'center',
      left: 'center',
      text: [`{value|${data.value.totalNum}}`, '{name|总数}'].join('\n'),
      textStyle: {
        rich: {
          value: {
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 20,
            padding: [4, 0, 4, 0],
          },
          name: {
            color: '#ffffff',
            lineHeight: 20,
          },
        },
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,0,0,.6)',
      borderColor: 'rgba(147, 235, 248, .8)',
      textStyle: {
        color: '#FFF',
      },
    },
    series: [
      {
        name: '用户总览',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 2,
        },
        color: colors,
        label: {
          formatter: '{b|{b}}\n{c|{c}个}   {per|{d}%}  ',
          rich: {
            b: {
              color: '#fff',
              fontSize: 12,
              lineHeight: 26,
            },
            c: {
              color: '#31ABE3',
              fontSize: 14,
            },
            per: {
              color: '#31ABE3',
              fontSize: 14,
            },
          },
        },
        labelLine: {
          show: true,
          length: 20, // 第一段线 长度
          length2: 36, // 第二段线 长度
          smooth: 0.2,
        },
        data: [
          {
            value: data.value.onlineNum,
            name: '在线',
            itemStyle: {
              color: echartsGraphic(['#0BFC7F', '#A3FDE0']),
            },
          },
          {
            value: data.value.offlineNum,
            name: '离线',
            itemStyle: {
              color: echartsGraphic(['#A0A0A0', '#DBDFDD']),
            },
          },
          {
            value: data.value.lockNum,
            name: '锁定',
            itemStyle: {
              color: echartsGraphic(['#F48C02', '#FDDB7D']),
            },
          },
          {
            value: data.value.alarmNum,
            name: '异常',
            itemStyle: {
              color: echartsGraphic(['#F4023C', '#FB6CB7']),
            },
          },
        ],
      },
    ],
  };
};

const getData = () => {
  data.value = {
    lockNum: 10,
    offlineNum: 20,
    onlineNum: 50,
    totalNum: 180,
    alarmNum: 100,
  };
  setOption();
};
getData();
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
