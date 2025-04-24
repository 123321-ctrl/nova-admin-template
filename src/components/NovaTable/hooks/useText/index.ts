import { h } from "vue";

import { getObjValue } from "../../lib/index";
import { handleEnum } from "./lib";
import type { Option } from "../../index.d";

export default function useText(item: any) {
  const { prop, props, separator, map } = item;
  return {
    render: (scope: any) => {
      const { row } = scope;
      const values = props?.length
        ? props.map((prop: any) => getObjValue(prop, row))
        : [getObjValue(prop, row)];

      // 处理枚举
      const items = handleEnum(values, map || item.options);

      const valueArr = items.map(({ label = "" }) => label);

      const value = valueArr?.join(separator || "") || "- -";
      return h("div", { style: { color: (items[0] as Option)?.color } }, value);
    },
  };
}
