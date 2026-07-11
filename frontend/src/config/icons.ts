// iconfont 图标名称映射
// 使用 SVG inline 方式，名称对应 Icon 组件的 name 属性

export const ICONS = {
  book: 'book',
  robot: 'robot',
  ai: 'robot',
  user: 'user',
  chart: 'chart',
  wrong: 'wrong',
  success: 'success',
  error: 'error',
  brain: 'brain',
  search: 'search',
  mail: 'mail',
  message: 'message',
  translate: 'translate',
  trophy: 'trophy',
  clock: 'clock',
  close: 'close',
  arrow: 'arrow',
} as const;

export type IconName = keyof typeof ICONS;

// 图标与名称的语义映射
export const ICON_LABELS: Record<string, string> = {
  [ICONS.book]: '书本',
  [ICONS.robot]: 'AI',
  [ICONS.user]: '用户',
  [ICONS.chart]: '图表',
  [ICONS.wrong]: '错词',
  [ICONS.success]: '成功',
  [ICONS.error]: '错误',
  [ICONS.brain]: '记忆',
  [ICONS.search]: '搜索',
  [ICONS.mail]: '邮箱',
  [ICONS.message]: '消息',
  [ICONS.translate]: '翻译',
  [ICONS.trophy]: '成就',
  [ICONS.clock]: '时间',
  [ICONS.close]: '关闭',
  [ICONS.arrow]: '箭头',
};
