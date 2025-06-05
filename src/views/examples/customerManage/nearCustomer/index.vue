<template>
  <div class="near-customer">
    <div class="container">
      <div class="left-view">
        <el-scrollbar ref="scrollView" class="scrollbar">
          <div class="contract-card">
            <el-card
              shadow="hover"
              class="box-card"
              v-for="(item, index) in cardList"
              :key="item.id"
              :ref="(el:any) => (clientRefs[index] = el)"
              :class="{
                active: activeClientIndex === index,
                invalid: !isValidPosition(item),
              }"
              @click="handleClientClick(index)"
            >
              <div class="title-wrap">
                <div class="tit">{{ item.companyName || "- -" }}</div>
                <div class="route">{{ (Number(15) || 0).toFixed(2) }}Km</div>
              </div>
              <div class="footer-warp">
                <div class="location">
                  {{
                    (item.provinceName || "") +
                      (item.cityName || "") +
                      (item.districtName || "") +
                      (item.address || "") || "- -"
                  }}
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
      <div class="map-container" ref="mapContainer"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onActivated, ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { getCustomerList } from "@/api/customerManage/nearCustomer/index";
import type { Customer } from "@/api/customerManage/nearCustomer/index.d";

defineOptions({
  name: "NearCustomer",
});

let query = ref({
  page: 1,
  limit: 30,
});
let total = ref(0);
let cardList = ref<Customer[]>([]);

let mapContainer = ref(null);
let mapInstance: any = null;
let infoWindow: any = null;

const markers: any = ref([]);
const activeClientIndex = ref(-1);
const clientRefs: any = [];

onActivated(() => {
  getList();
});

const getList = async () => {
  try {
    const {
      data: { list, count },
    } = await getCustomerList(query.value);
    cardList.value = list;
    total.value = count;

    initMap();
  } catch (error) {
    console.log(error);
  }
};

const isValidPosition = (customer: Customer) => {
  return (
    typeof customer.longitude === "number" &&
    typeof customer.latitude === "number"
  );
};

const initMap = async () => {
  const AMap = await AMapLoader.load({
    key: "f8a2ca0b60ead4ee6bcfeb50a40a6358",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar"],
  });

  // 找到第一个有效坐标作为地图中心
  const firstValid = cardList.value.find((c) => isValidPosition(c));
  const firstIndex = cardList.value.findIndex((c) => isValidPosition(c));
  mapInstance = new AMap.Map(mapContainer.value, {
    center: firstValid
      ? [firstValid.longitude, firstValid.latitude]
      : [114.232439, 22.695842],
    zoom: 14,
    zoomControls: true,
    scrollable: true,
    doubleClickZoom: true,
  });

  // 插件启用
  mapInstance.addControl(new AMap.Scale());
  mapInstance.addControl(new AMap.ToolBar());
  mapInstance.addControl(new AMap.ControlBar());

  // 创建标记点
  cardList.value.forEach((client, index) => {
    if (!isValidPosition(client)) return;

    const marker = new AMap.Marker({
      position: [client.longitude, client.latitude],
      map: mapInstance,
      title: client.companyName,
      icon: new AMap.Icon({
        image:
          "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
        size: new AMap.Size(20, 30), // 设置显示大小（宽度，高度）
        imageSize: new AMap.Size(20, 30), // 设置图片实际大小（避免拉伸）
      }),
    });

    // 创建 InfoWindow 实例（延迟创建）
    infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(8, 0) });

    marker.on("click", () => {
      scrollToClient(index);

      // 设置 infoWindow 内容并打开
      infoWindow.setContent(`
      <div style="min-width: 150px;">
        <strong>${client.companyName}</strong><br/>
        经纬度: ${client.longitude}, ${client.latitude}
      </div>
    `);
      infoWindow.open(mapInstance, [client.longitude, client.latitude]);
    });

    markers.value.push(marker);
  });

  // 👉 自动选中第一个有坐标的客户
  if (firstValid && firstIndex !== -1) {
    scrollToClient(firstIndex);
    mapInstance.setCenter([firstValid.longitude, firstValid.latitude]);

    const marker = markers.value[firstIndex];
    if (marker) {
      marker.setAnimation("AMAP_ANIMATION_BOUNCE");
      setTimeout(() => marker.setAnimation(null), 500);
    }
  }
};

// 滚动到指定客户项并高亮
function scrollToClient(index: number) {
  activeClientIndex.value = index;
  const el = clientRefs[index];
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// 点击左侧客户列表项
function handleClientClick(index: number) {
  const client = cardList.value[index];
  activeClientIndex.value = index;

  if (!isValidPosition(client)) {
    alert("该客户没有有效的定位信息");
    return;
  }

  const position = [client.longitude, client.latitude];
  mapInstance.setZoom(16);
  mapInstance.setCenter(position);

  const marker = markers.value[index];
  if (marker) {
    marker.setAnimation("AMAP_ANIMATION_BOUNCE");
    setTimeout(() => marker.setAnimation(null), 500);
  }
}
</script>
<style lang="scss" scoped>
.near-customer {
  height: 100%;
  .container {
    box-sizing: border-box;
    display: flex;
    height: 100%;
    padding: 12px;
    .left-view {
      height: 100%;
      width: 30%;
      .scrollbar {
        height: 100%;
        .contract-card {
          padding: 0 20px 0 0;
          height: 100%;
          .box-card {
            cursor: pointer;
            &.active {
              background: #e0f7ff;
              border-left: 4px solid #2196f3;
            }
            &.invalid {
              background: #fbeaea;
              color: #888;
              cursor: not-allowed;
            }
            & + .box-card {
              margin-top: 10px;
            }
            :deep(.el-card__body) {
              padding: 14px;
            }
            .title-wrap {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-weight: 600;
              white-space: nowrap;
              .tit {
                font-size: 12px;
                max-width: 300px;
                padding-right: 20px;
                color: #008cee;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .route {
                color: #333333;
              }
            }
            .footer-warp {
              display: flex;
              .location {
                color: #333333;
              }
            }
          }
        }
      }
    }
  }

  .map-container {
    flex: 1;
  }
}
</style>
