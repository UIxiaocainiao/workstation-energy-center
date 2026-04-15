/**
 * 后端通常不直接执行 UI 动画。
 * 这里保留统一的数学辅助位，便于后续生成动画配置或数值策略。
 */
export function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value));
}
