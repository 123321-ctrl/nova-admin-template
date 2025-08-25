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

// 👉 判断经纬度是否有效
const isValidPosition = (customer: Customer) => {
  return (
    typeof customer.longitude === "number" &&
    typeof customer.latitude === "number"
  );
};

// 滚动到指定客户项并高亮
function scrollToClient(index: number) {
  activeClientIndex.value = index;
  const el = clientRefs[index];
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

const highlightMarkerRef = ref<(index: number) => void>(() => {});
// 点击左侧客户列表项
function handleClientClick(index: number) {
  const client = cardList.value[index];
  if (!isValidPosition(client)) {
    alert("该客户没有有效的定位信息");
    return;
  }
  activeClientIndex.value = index;

  const position = [client.longitude, client.latitude];
  mapInstance.setCenter(position);

  highlightMarkerRef.value(index);

  // 显示 InfoWindow
  openInfoWindow(client);
}

const openInfoWindow = (client: Customer) => {
  const view = `
      <div style="min-width: 150px;">
        <strong>${client.companyName}</strong><br/>
        经纬度: ${client.longitude}, ${client.latitude}
      </div>
    `;
  infoWindow.setContent(view);
  infoWindow.open(mapInstance, [client.longitude, client.latitude]);
};

const initMap = async () => {
  const AMap = await AMapLoader.load({
    key: "f8a2ca0b60ead4ee6bcfeb50a40a6358",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar"],
  });

  const defaultIconSize = new AMap.Size(20, 20);
  const activeIconSize = new AMap.Size(30, 30);

  // 👉 设置某个 marker 图标大小
  function setMarkerSize(index: number, active: boolean) {
    const marker = markers.value[index];
    if (!marker) return;
    const icon = new AMap.Icon({
      size: active ? activeIconSize : defaultIconSize,
      image: new URL("@/assets/images/map/map-marker-icon.png", import.meta.url)
        .href,
      imageSize: active ? activeIconSize : defaultIconSize,
    });
    marker.setIcon(icon);
    marker.setzIndex(100);
  }

  // 👉 高亮并放大某个 marker
  function highlightMarker(index: number) {
    markers.value.forEach((_: any, i: number) => {
      setMarkerSize(i, i === index);
    });
  }
  highlightMarkerRef.value = highlightMarker;

  // 创建 InfoWindow 实例（延迟创建）
  infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(8, 0) });

  // 找到第一个有效坐标作为地图中心
  const firstValid = cardList.value.find((c) => isValidPosition(c));
  const firstIndex = cardList.value.findIndex((c) => isValidPosition(c));

  mapInstance = new AMap.Map(mapContainer.value, {
    center: firstValid
      ? [firstValid.longitude, firstValid.latitude]
      : [114.232439, 22.695842],
    zoom: 15,
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
    // if (!isValidPosition(client)) return;

    const marker = new AMap.Marker({
      position: [client.longitude, client.latitude],
      map: mapInstance,
      title: client.companyName,
      icon: new AMap.Icon({
        image: new URL(
          "@/assets/images/map/map-marker-icon.png",
          import.meta.url
        ).href,
        size: defaultIconSize,
        imageSize: defaultIconSize,
      }),
      offset: new AMap.Pixel(-12, -12), // 设置锚点为图标的中心
    });

    marker.on("click", () => {
      // 滚动到指定客户项并高亮
      scrollToClient(index);
      highlightMarker(index);

      mapInstance.setCenter([client.longitude, client.latitude]);

      // 设置 infoWindow 内容并打开
      openInfoWindow(client);
    });

    markers.value.push(marker);
  });

  // 👉 自动选中第一个有坐标的客户
  if (firstValid && firstIndex !== -1) {
    scrollToClient(firstIndex);

    highlightMarker(firstIndex);
    openInfoWindow(firstValid);
  }
};
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
