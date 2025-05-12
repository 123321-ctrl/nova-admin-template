### 大屏的技术实现方案

#### 实现组件 ScaleScreen，传入设计稿中的宽高与防抖延时

实现思路：

1. onMounted 时，
   先初始化大屏容器宽高 initSize(),
   再更新大屏容器宽高 updateSize()【此时容器的宽高就是设计稿中的宽高】,
   再根据计算得出缩放比例 updateScale()【根据真实视口的宽高与大屏最后的宽度计算出缩放比例，按照最小的比例进行缩放】,
   最后对容器进行缩放 transform: scale()。

2. 监听响应式变化 window.addEventListener("resize", onResize);

3. 写样式时，可直接根据设计稿中的宽高来写

可注意的点：MutationObserver

关键代码

```
initSize()
if (props.width && props.height) {
    state.value.width = props.width;
    state.value.height = props.height;
}

updateSize()
if (state.value.width && state.value.height) {
    screenWrapper.value!.style.width = `${state.value.width}px`;
    screenWrapper.value!.style.height = `${state.value.height}px`;
}

updateScale()
// 获取真实视口尺寸
  const currentWidth = document.body.clientWidth;
  const currentHeight = document.body.clientHeight;

// 获取大屏最终的宽高
  const realWidth = state.value.width;
  const realHeight = state.value.height;

// 计算缩放比例
  const widthScale = currentWidth / +realWidth!;
  const heightScale = currentHeight / +realHeight!;

// 按照宽高最小比例进行缩放
  const scale = Math.min(widthScale, heightScale);
```
