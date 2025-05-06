import { h } from "vue";

import { getObjValue } from "../../lib/index";
import { handleEnum, handleValues } from "./lib";
import type { Option, ColumnItem } from "../../index.d";
import { isString, isSimpleArray } from "@utils/types";

export default function useText(this: any, item: ColumnItem) {
  const { prop, props, separator, map, unit = "", cellClass, color } = item;
  const { emptyValue: defaultEmptyValue } = this;

  const emptyValue = item.emptyValue ? item.emptyValue : defaultEmptyValue;

  const prefixText = Array.isArray(unit) ? unit[0] || "" : "";
  const nearText = isString(unit)
    ? unit
    : Array.isArray(unit)
    ? unit[1] || ""
    : "";
  return {
    render: (scope: any) => {
      const { row } = scope;
      const values = props?.length
        ? props.map((prop) => getObjValue(prop, row))
        : [getObjValue(prop, row)];

      if (!values || !values.length)
        return h("span", { class: "nova-table-text-view" }, emptyValue);

      // 处理枚举
      const items = handleEnum(values, map || item.options);

      // 格式化
      const valueRaws = handleValues(items, item, scope);

      const valueArr = valueRaws.map(
        ({ label = "" }: any) =>
          `${prefixText}${
            isSimpleArray(label) ? label.join(separator || ",") : label
          }${nearText}`
      );

      const value =
        cellClass === "column"
          ? valueArr.map((x, i) =>
              h("div", { style: { color: color?.[i] } }, x)
            )
          : valueArr?.join(separator || "") || "- -";
      return h("div", { style: { color: (items[0] as Option)?.color } }, value);
    },
  };
}
