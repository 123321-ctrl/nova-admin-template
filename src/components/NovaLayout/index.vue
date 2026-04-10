<script lang="ts">
import { defineComponent, h, ref } from 'vue';
import type { VNode } from 'vue';
import { props as propConfig } from './index';
import { useSidebar } from './hooks/useSidebar';
import { useHeader } from './hooks/useHeader';

import './styles/index.scss';

export default defineComponent({
  name: 'NovaLayout',
  props: propConfig,
  setup(props, that) {
    let { slots } = that;
    let isCollapse = ref(false);

    /**
     * @description: 合并
     */
    let context = Object.assign({ props, isCollapse }, that);
    /**
     * @description: 侧边栏
     * @return {*}
     */
    let { render: sidebar } = useSidebar(context);
    /**
     * @description: 顶部栏
     * @return {*}
     */
    let { render: header } = useHeader(context);

    let main = () => {
      return h('div', { class: 'nova-layout-main' }, slots.default ? slots.default() : '');
    };

    let render = () => {
      let layoutMaps: { [key: string]: VNode[] } = {
        default: [sidebar(), h('div', { class: 'nova-layout-container' }, [header(), main()])],
        vertical: [header(), h('div', { class: 'nova-layout-container' }, [sidebar(), main()])],
      };

      return h(
        'div',
        {
          class: ['nova-layout', props.layout],
          style: {
            // 侧边栏宽度
            '--layout-sidebar-width': `var(${isCollapse.value ? '--layout-sidebar-default-shrink-width' : '--layout-sidebar-default-width'})`,
          },
        },
        layoutMaps[props.layout],
      );
    };
    return render;
  },
});
</script>
