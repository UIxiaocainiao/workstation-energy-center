import type { PropsWithChildren } from "react";

/**
 * React Bits 的正式组件名和导入方式可以在接入时按 UI 方案替换。
 * 这里先提供统一包装层，避免页面代码直接依赖第三方 API。
 */
export function FadeIn(props: PropsWithChildren<{ className?: string }>) {
  return <div className={props.className}>{props.children}</div>;
}

export function SlideUp(props: PropsWithChildren<{ className?: string }>) {
  return <div className={props.className}>{props.children}</div>;
}
