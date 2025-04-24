import { isObject } from "@/utils/types";
import type { Option } from "../../index.d";

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
