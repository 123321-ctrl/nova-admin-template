import { h } from "vue";
import { ElTag } from "element-plus";
import { getObjValue } from "../../lib/index";
import { handleData, handleEnum } from "./lib";
import "./index.scss";

export default function useTags(this: any, item: any) {
  const { prop, labelKey = "label", map, options, attrs = {} } = item;
  const { emptyValue } = this;
  return {
    render: (scope: any) => {
      const { row } = scope;
      const value = getObjValue(prop, row);

      if (!value) return emptyValue;

      const values = handleData(value, labelKey);

      if (!values.length) return emptyValue;

      const items = handleEnum(values as string[], map || options);

      if (!items.length) return emptyValue;

      const tags = items.map((item) => {
        return h(
          ElTag,
          {
            disableTransitions: true,
            size: "small",
            type: item?.type,
            ...attrs,
          },
          () => item.label
        );
      });

      return h("div", { class: "nova-table-tags-view" }, tags);
    },
    defaultMinWidth: 160,
  };
}
