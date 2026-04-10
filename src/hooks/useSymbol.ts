import { h, inject } from 'vue';

/**
 * @description: 图标
 */
export function useSymbol(symbol: string = '') {
  const namespace = inject('iconPrefix', '');
  if (!symbol) return;
  if (
    /^data:([A-Za-z-+/]+);base64,(.+)$/.test(symbol) ||
    symbol.startsWith('http') ||
    symbol.startsWith('https')
  ) {
    return h('img', { src: symbol });
  }
  if (symbol.includes('</svg>')) {
    return h('i', { innerHTML: symbol });
  }
  return h('svg', {}, [h('use', { href: `#${namespace}${namespace ? '-' : ''}${symbol}` })]);
}
