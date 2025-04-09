import { h } from "vue";
import { ElTableColumn } from "element-plus";

export function useIndexColumn(context: any) {
  const { props } = context;

  return {
    render: () => {
      if (!props.indexColumn) return;
      return h(ElTableColumn, {
        key: "index",
        type: "index",
        className: "index-column",
        label: "序号",
        width: "60px",
        minWidth: 60,
        prop: "index",
      });
    },
  };
}
