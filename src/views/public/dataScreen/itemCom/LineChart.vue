<template>
  <NovaChart class="chart" :option="option" autoresize />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import NovaChart from "@/components/NovaChart/index.vue";

import { use, graphic } from "echarts/core";
import { LineChart } from "echarts/charts";
import { MarkPointComponent } from "echarts/components";
use([LineChart, MarkPointComponent]);

defineOptions({
  name: "LineChart"
});

const option = ref({});

onMounted(() => {
  getData();
});

const getData = () => {
  const data = {
    dateList: ["2023-11", "2023-12", "2024-01", "2024-02", "2024-03", "2024-04"],
    numList: [188, 715, 656, 304, 734, 486],
    numList2: [820, 957, 481, 256, 763, 20]
  };
  setOption(data.dateList, data.numList, data.numList2);
};

const setOption = async (xData: any[], yData: any[], yData2: any[]) => {
  option.value = {
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false, // 不留白，从原点开始
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(31,99,163,.2)"
        }
      },
      axisLine: {
        lineStyle: {
          color: "rgba(31,99,163,.1)"
        }
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500"
      }
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(31,99,163,.2)"
        }
      },
      axisLine: {
        lineStyle: {
          color: "rgba(31,99,163,.1)"
        }
      },
      axisLabel: {
        color: "#7EB7FD",
        fontWeight: "500"
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF"
      }
    },
    grid: {
      //布局
      show: true,
      left: "10px",
      right: "30px",
      bottom: "10px",
      top: "32px",
      containLabel: true,
      borderColor: "#1F63A3"
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true,
        symbol: "none", //去除点
        name: "报警1次数",
        color: "rgba(252,144,16,.7)",
        areaStyle: {
          //右，下，左，上
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(252,144,16,.7)"
              },
              {
                offset: 1,
                color: "rgba(252,144,16,.0)"
              }
            ],
            false
          )
        },
        markPoint: {
          data: [
            {
              name: "最大值",
              type: "max",
              valueDim: "y",
              symbol: "rect",
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: "rgba(0,0,0,0)"
              },
              label: {
                color: "#FC9010",
                backgroundColor: "rgba(252,144,16,0.1)",
                borderRadius: 6,
                padding: [7, 14],
                borderWidth: 0.5,
                borderColor: "rgba(252,144,16,.5)",
                formatter: "报警1：{c}"
              }
            }
          ]
        }
      },
      {
        data: yData2,
        type: "line",
        smooth: true,
        symbol: "none", //去除点
        name: "报警2次数",
        color: "rgba(9,202,243,.7)",
        areaStyle: {
          //右，下，左，上
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(9,202,243,.7)"
              },
              {
                offset: 1,
                color: "rgba(9,202,243,.0)"
              }
            ],
            false
          )
        },
        markPoint: {
          data: [
            {
              name: "最大值",
              type: "max",
              valueDim: "y",
              symbol: "rect",
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: "rgba(0,0,0,0)"
              },
              label: {
                color: "#09CAF3",
                backgroundColor: "rgba(9,202,243,0.1)",

                borderRadius: 6,
                borderColor: "rgba(9,202,243,.5)",
                padding: [7, 14],
                formatter: "报警2：{c}",
                borderWidth: 0.5
              }
            }
          ]
        }
      }
    ]
  };
};
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
