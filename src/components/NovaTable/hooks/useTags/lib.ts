import {
  isString,
  isSimpleArray,
  isObject,
  isNumber,
  isNotNull,
} from "@utils/types";
import type { Option } from "../../index.d";
import type { ValueTypes } from "./index.d";

export const handleData = (
  value: number | number[] | string[] | string | ValueTypes | ValueTypes[],
  labelKey: string
) => {
  isString(value) && (value = (value as string).split(","));
  isNumber(value) && (value = [value] as number[]);

  if (isSimpleArray(value)) {
    return (value as string[]).filter(isNotNull);
  }

  if (isObject(value)) {
    return [(value as ValueTypes)[labelKey]].filter(isNotNull);
  }

  return (value as ValueTypes[])
    .map((item) => item[labelKey])
    .filter(isNotNull);
};

export const handleEnum = (values: string[], options?: Option[]) => {
  if (!options) {
    return values.map((label) => {
      return { label };
    }) as Option[];
  }

  if (isObject(options)) {
    options = Object.entries(options).map(([key, value]) => {
      return {
        value: key,
        ...(typeof value === "string" ? { label: value } : (value as Option)),
      };
    }) as Option[];
  }

  return values
    .map((value) => {
      return options.find((item) => String(item.value) === String(value));
    })
    .filter(isNotNull) as Option[];
};
