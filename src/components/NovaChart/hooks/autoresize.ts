import type { Ref } from 'vue';
import type { EChartsType, AutoResize } from '../types';

export function useAutoresize(
  chart: Ref<EChartsType | undefined>,
  autoresize: Ref<AutoResize | undefined>,
  root: Ref<HTMLElement | undefined>,
): void {}
