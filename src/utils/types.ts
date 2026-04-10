/**
 * @description: 是否不为无效值
 * @param {any} obj
 * @return {*}
 */
export const isNotNull = (value: any) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * @description: 是否为对象
 * @param {any} obj
 * @return {*}
 */
export const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * @description: 是否为字符串
 * @param {any} string
 * @return {*}
 */
export const isString = (string: any) => {
  return typeof string === 'string';
};

export const isNumber = (string: any) => {
  return typeof string === 'number';
};

/**
 * @description: 是否为简易数组
 * @param {any} array
 * @return {*}
 */
export const isSimpleArray = (array: any) => {
  if (Array.isArray(array) && array.every((x) => !isObject(x))) {
    return true;
  }
  return false;
};
