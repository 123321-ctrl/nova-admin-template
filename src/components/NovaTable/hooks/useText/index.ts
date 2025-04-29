import { h } from "vue";

import { getObjValue } from "../../lib/index";
import { handleEnum } from "./lib";
import type { Option } from "../../index.d";
import { isString } from "@utils/types";

export default function useText(this: any, item: any) {
  const { prop, props, separator, map, unit = "", cellClass } = item;
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
        ? props.map((prop: any) => getObjValue(prop, row))
        : [getObjValue(prop, row)];

      if (!values || !values.length)
        return h("span", { class: "nova-table-text-view" }, emptyValue);

      // 处理枚举
      const items = handleEnum(values, map || item.options);

      const valueArr = items.map(
        ({ label = "" }) => `${prefixText}${label}${nearText}`
      );

      const value =
        cellClass === "column"
          ? valueArr.map((x, i) => h("div", {}, x))
          : valueArr?.join(separator || "") || "- -";
      return h("div", { style: { color: (items[0] as Option)?.color } }, value);
    },
  };
}
