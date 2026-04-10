import type { Text } from './useText/index.d';
import type { Tags } from './useTags/index.d';
import type { Images } from './useImages/index.d';
import type { Date } from './useDate/index.d';

/**
 * @description: 类型合并
 */
type Types = Text & Tags & Images & Date;
export type { Types };
