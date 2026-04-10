/**
 * @description: 获取对象值
 * @return {*}
 */
export const getObjValue = (prop?: string, data?: any) => {
  const propList = (prop || '').trim().split('.');
  propList.forEach((item) => {
    if (!data) return '';
    data = data[item];
  });

  return data;
};
