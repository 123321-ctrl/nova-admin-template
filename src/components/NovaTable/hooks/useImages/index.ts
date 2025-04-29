import { h } from "vue";
import { ElImage } from "element-plus";
import { getSizeObj } from "./lib";

export default function useImages(this: any, item: any) {
  const { prop, size = "30px" } = item;
  return {
    render: (scope: any) => {
      const attrs = { ...getSizeObj(size) } as { [key: string]: any };

      const { row } = scope;
      const value = row[prop];

      return h("div", {}, [h(ElImage, { fit: "cover", src: value, ...attrs })]);
    },
  };
}
