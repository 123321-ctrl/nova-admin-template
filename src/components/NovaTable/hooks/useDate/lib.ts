import { isNumber } from '@/utils/types';

export const handleDate = (values: string[] | number[], format: string) => {
  return values.map((value) => {
    if (isNumber(value)) {
      const v = (value as number) * 1000; // 通常是将秒级时间戳转为毫秒级
    }
  });
};
