import { h } from "vue";
import { ElImage } from "element-plus";
import { getObjValue } from "../../lib/index";
import { getSizeObj } from "./lib";
import type { ColumnItem } from "../../index.d";

export default function useImages(this: any, item: ColumnItem) {
  const { prop, size = "30px" } = item;
  return {
    render: (scope: any) => {
      const attrs = { ...getSizeObj(size) } as { [key: string]: any };

      const { row } = scope;
      const value = getObjValue(prop as string, row);

      return h("div", {}, [h(ElImage, { fit: "cover", src: value, ...attrs })]);
    },
  };
}
