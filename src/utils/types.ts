/**
 * @description: 是否为对象
 * @param {any} obj
 * @return {*}
 */
export const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
