import type { Option, ColumnItem } from "../../index.d";
import type { Date } from "./index.d";
import { getObjValue } from "../../lib/index";
import { handleDate } from "./lib";

export default function useDate(this: any, item: ColumnItem) {
  const { prop, props, format = "YYYY-MM-DD HH:mm:ss" } = item;
  const { emptyValue } = this.props;

  return {
    render: (scope: any) => {
      const { row } = scope;
      const values = props?.length ? props.map((prop) => getObjValue(prop, row)) : [getObjValue(prop, row)];

      if (!values || !values.length) return emptyValue;
      const items = handleDate(values, format);
    }
  };
}

export { type Date };
