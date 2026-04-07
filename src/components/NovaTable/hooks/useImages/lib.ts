/**
 * @description: 大小处理
 * @param {string} size
 * @return {*}
 */
export const getSizeObj = (size: string | string[]) => {
  let width = size,
    height = size;
  if (Array.isArray(size)) {
    ((width = size[0]), (height = size[1]));
  }
  return {
    style: {
      width,
      height
    }
  };
};
