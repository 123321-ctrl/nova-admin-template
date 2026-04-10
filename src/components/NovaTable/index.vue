<script lang="ts">
import { defineComponent, h, computed, ref } from 'vue';
import { ElTable, ElTableColumn, ElConfigProvider } from 'element-plus';
import { props as propConfig } from './index';
import { useIndexColumn } from './tableHooks/useIndexColumn';
import { usePagination } from './tableHooks/usePagination';

import useHooks from './hooks/index';

// import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// import en from "element-plus/dist/locale/en.mjs";

import './styles/index.scss';

export default defineComponent({
  name: 'NovaTable',
  props: propConfig,
  setup(props, that) {
    const language = ref('zh-cn');
    // const locale = computed(() => (language.value === "zh-cn" ? zhCn : en));

    let isDialog = props.isDialog;
    let values = computed(() => props.values);

    let tableColumnData = ref<any>();

    /**
     * @description: 合并
     */
    let context = Object.assign({ props }, that);

    // 序号列
    let { render: indexColumn } = useIndexColumn(context);
    /**
     * @description: 分页
     */
    const { render: pagination } = usePagination(context);

    const initTableColumn = () => {
      let that = Object.assign({}, props);
      function getcolumnList(data: any) {
        return data.map((item: any) => {
          const { label = '', prop = '', type = 'text', minWidth } = item;

          let { render, defaultMinWidth } = useHooks[type].default.call(that, item);
          return {
            data: {
              label,
              prop,
              minWidth: minWidth || defaultMinWidth,
            },
            render: {
              default: (scope: any) => [render(scope)],
            },
          };
        });
      }
      return getcolumnList(props.config);
    };
    /**
     * @description: 处理详情列表操作
     * @return {*}
     */

    ['table', 'virtual', 'descriptions'].includes(props.type) &&
      (tableColumnData.value = initTableColumn());

    let getFilterColumns = (columnData: any = tableColumnData.value) => {
      let values = columnData;
      return values.map((x: any) => {
        return h(ElTableColumn, x.data, { ...x.render });
      });
    };

    let initTable = () => {
      return h(
        ElTable,
        { class: 'nova-table-main', data: values.value, border: props.border },
        {
          default: () => [indexColumn(), , getFilterColumns()],
        },
      );
    };

    let initTableRender = () => {
      let titleEle = h('div', { class: 'nova-table-title' }, [
        h('div', { class: 'nova-table-title-name' }, props.title),
      ]);
      const tabeEle = h('div', { class: 'nova-table-container' }, [
        props.type === 'table' && initTable(),
      ]);
      let paginationEle = pagination();
      // ()=>[
      //   titleEle,
      //   tabeEle,
      //   paginationEle,
      // ]
      return h('div', { class: 'nova-table' }, [
        titleEle,
        h('div', { class: 'nova-table-body' }, [tabeEle, paginationEle]),
      ]);
    };

    /**
     * @description: 渲染
     */
    let render = () => {
      return isDialog ? null : initTableRender();
    };
    return render;
  },
});
</script>
