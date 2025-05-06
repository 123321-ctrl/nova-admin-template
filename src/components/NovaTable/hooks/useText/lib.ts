import { isObject, isString } from "@/utils/types";
import type { Option } from "../../index.d";
import type { ColumnItem } from "../../index.d";

export const handleEnum = (
  values: string[],
  options?: Option[] | { [key: string]: string | Option }
) => {
  if (!options) {
    return values.map((value) => {
      return { label: value };
    });
  }
  if (isObject(options)) {
    options = Object.entries(options).map(([key, value]) => {
      return {
        value: key,
        ...(typeof value === "string" ? { label: value } : value),
      };
    });
  }

  return values.map((value) => {
    const item = (options as Option[]).find(
      (item) => String(item.value) === String(value)
    );
    return item;
  }) as Option[];
};

export const handleValues = (
  values: Option[],
  item: ColumnItem,
  scope: any
) => {
  const { formatter, toFixed } = item;
  if (isString(formatter)) {
    if (formatter === "kilobit") {
      return values.map((item) => {
        let value = item.label;
        const str = Number(value)
          .toFixed(toFixed || 2)
          .toString()
          .split(".");

        value = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + str[1];
        return {
          ...item,
          label: value,
        };
      });
    } else {
      return values.map((item) => {
        return {
          ...item,
          label: formatString(formatter as string, scope.row),
        };
      });
    }
  }

  return values;
};

/**
 * @description: 字符串模板格式化
 * @return {*}
 */
const formatString = (template: string, data: any) => {
  return template.replace(/{@(\w+)}/g, function (_match, p1) {
    return data[p1] || "";
  });
};
