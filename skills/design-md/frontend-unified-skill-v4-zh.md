# 前端统一 Skill（中文终极版 v4）

> 一份面向前端工程师的统一技能文档，整合设计系统、主题架构、shadcn/ui 工程规范、动画模块、多端适配能力与全栈项目创建规范。
>
> **v4 更新：** 新增第 18 章「项目创建模块」，完整收录 workstation-energy-center 全栈项目脚手架规范，包含目录结构、关键文件约定、命名规范与初始化流程。  
> **v3 更新：** 修复 scroll-reveal Tailwind 变体 bug、补充 SSR 防主题闪烁方案、修正章节编号错乱、新增审美参考基准章节。

---

## 1. 文档目标

这份 Skill 用来解决前端项目中最容易割裂的五件事：

- 视觉风格不统一
- 深浅主题切换不系统
- shadcn/ui 组件使用不规范
- 动画效果零散、不可维护
- 多端适配只做了断点，没有覆盖交互逻辑与尺寸规范

它不是单纯的设计说明，也不是单纯的代码规范，而是一套**可直接指导前端工程师落地的统一标准**。

适用场景：

- 品牌官网
- SaaS 官网
- AI 产品页
- 管理后台
- Dashboard
- H5 / Mobile Web
- 需要后续扩展 App / Desktop 的前端项目

---

## 2. 核心定位

这套统一 Skill 的目标是让项目同时具备：

- 高级感与设计统一性
- 工程可维护性
- 深浅主题可扩展性
- 组件体系标准化
- 动画表达可控且可降级
- 多端布局、交互、尺寸适配能力

这是一套从 **Token → 组件 → 页面 → 动画 → 多端适配** 的前端系统化方案。

---

## 3. 总体原则

### 3.1 设计原则

1. **对比要强，但不能吵**  
   通过明暗、层级、留白和文字权重建立秩序，而不是靠大量装饰。

2. **留白是结构的一部分**  
   空白不是浪费，而是帮助页面建立节奏和高级感。

3. **排版优先于装饰**  
   优先用字号、字重、行高、字距来解决层级问题。

4. **边框比重阴影更稳定**  
   尤其在深色主题中，优先用边框与表面对比建立层次。

5. **动效服务于理解，不服务于炫技**  
   动画要帮助用户感知结构、状态和节奏，而不是制造干扰。

### 3.2 工程原则

1. 使用语义化 Token，不直接写死原始颜色值
2. 优先使用已有组件，不随意重复造轮子
3. 优先组合，而不是重写样式
4. 主题从第一天开始就要支持扩展
5. 动画必须支持降级与复用
6. 多端适配不仅是响应式，还包括交互与组件行为差异

---

## 4. 设计语言

### 4.1 整体气质

统一风格融合了以下方向：

- Resend 风格的高级、克制、带电影感的视觉表达
- shadcn/ui 的组件化工程能力
- 更清晰的深浅主题机制
- 更适合产品化落地的统一规则

### 4.2 关键词

建议整体风格围绕这些关键词：

- 高级
- 现代
- 冷静
- 精准
- 技术感
- 克制
- 统一
- 有品牌感

应避免：

- 过度花哨
- 过度炫光
- 颜色杂乱
- 元素堆砌
- 没有节制的装饰化设计

### 4.3 审美参考基准

好的设计不只靠文字描述，以下是对齐团队审美标准的参考坐标：

**✅ 对味的参考（值得学习的方向）**

| 网站 | 学什么 |
|---|---|
| [resend.com](https://resend.com) | 极致克制的深色官网，字号层级、留白节奏、品牌色用法 |
| [vercel.com](https://vercel.com) | 黑白为主的技术感，图表与动效融入页面结构 |
| [linear.app](https://linear.app) | 信息密度高但不乱，深色 Dashboard 的典范 |
| [raycast.com](https://raycast.com) | 渐变氛围与产品截图的组合方式，高级感来自细节 |
| [ui.shadcn.com](https://ui.shadcn.com) | 组件文档的信息结构，轻量但精准 |

**❌ 需要主动规避的常见问题**

| 问题 | 典型症状 |
|---|---|
| AI 平庸感 | 紫色渐变背景 + Inter 字体 + 千篇一律的卡片布局 |
| 过度装饰 | 每个模块都有 glow 光晕、噪点纹理、玻璃拟态 |
| 颜色失控 | 品牌色出现在 10 个以上不同的地方，没有主次 |
| 层次混乱 | 所有元素视觉权重相近，找不到视线落点 |
| 动效干扰 | 用户还没读完内容，动画就已经结束或循环播放 |

**判断标准：** 页面截图单独看，如果 3 秒内说不清"这个产品是做什么的、重点在哪"，说明信息层次有问题。

---

## 5. 主题系统

### 5.1 主题模式

必须支持三种主题状态：

- `light`
- `dark`
- `system`

### 5.2 主题层级结构

所有主题都必须遵循三层结构：

1. **原子 Token（Atomic Tokens）**  
   颜色、圆角、阴影、间距、时长等原始基础值

2. **语义 Token（Semantic Tokens）**  
   背景、文字、边框、品牌色、成功、警告等具有功能含义的值

3. **组件 Token（Component Tokens）**  
   Button、Card、Input、Dialog、Badge、Chart 等组件的专用值

这样做的好处：

- 换品牌色不需要重写组件
- 后续可新增高对比主题
- 可新增活动主题 / 产品线主题
- 可以做 A/B 的主题变体

---

## 6. 深浅主题基础 Token

### 6.1 Light Mode

```css
:root,
[data-theme="light"] {
  --bg: #FFFFFF;
  --surface: #F5F5F5;
  --text-primary: #111111;
  --text-secondary: #666666;
  --border: #D9D9D9;
  --brand-primary: #EC5331;
  --black: #000000;
  --white: #FFFFFF;
}
```

### 6.2 Dark Mode

```css
[data-theme="dark"] {
  --bg: #0A0A0A;
  --surface: #121212;
  --card: #1A1A1A;
  --text-primary: #F5F5F5;
  --text-secondary: #B3B3B3;
  --border: #333333;
  --divider-soft: #262626;
  --brand-primary: #EC5331;
  --black: #000000;
  --white: #FFFFFF;
}
```

### 6.3 基础要求

- 这些 Token 属于主题底层，可被后续扩展主题覆盖
- 新主题要保持语义一致，不要直接复制一堆零散颜色
- 修改主题时优先改 Token，不直接改组件实现

### 6.4 示例代码：完整主题基础文件

```css
@layer base {
  :root,
  [data-theme="light"] {
    --bg: #ffffff;
    --surface: #f5f5f5;
    --card: #ffffff;
    --text-primary: #111111;
    --text-secondary: #666666;
    --border: #d9d9d9;
    --divider-soft: #ececec;
    --brand-primary: #ec5331;
    --black: #000000;
    --white: #ffffff;
  }

  [data-theme="dark"] {
    --bg: #0a0a0a;
    --surface: #121212;
    --card: #1a1a1a;
    --text-primary: #f5f5f5;
    --text-secondary: #b3b3b3;
    --border: #333333;
    --divider-soft: #262626;
    --brand-primary: #ec5331;
    --black: #000000;
    --white: #ffffff;
  }

  html {
    color-scheme: light dark;
  }

  body {
    background: var(--bg);
    color: var(--text-primary);
  }
}
```

---

## 7. 语义 Token 映射

建议把基础 Token 映射成项目代码中真正使用的语义 Token：

```css
:root,
[data-theme="light"] {
  --background: var(--bg);
  --foreground: var(--text-primary);
  --muted: var(--surface);
  --muted-foreground: var(--text-secondary);
  --border-color: var(--border);
  --card-bg: #FFFFFF;
  --card-foreground: var(--text-primary);
  --input-bg: #FFFFFF;
  --input-foreground: var(--text-primary);
  --primary: var(--brand-primary);
  --primary-foreground: var(--white);
  --secondary: #EFEFEF;
  --secondary-foreground: var(--text-primary);
  --accent: #F7E2DD;
  --accent-foreground: #7B2C1B;
}

[data-theme="dark"] {
  --background: var(--bg);
  --foreground: var(--text-primary);
  --muted: var(--surface);
  --muted-foreground: var(--text-secondary);
  --border-color: var(--border);
  --card-bg: var(--card);
  --card-foreground: var(--text-primary);
  --input-bg: #151515;
  --input-foreground: var(--text-primary);
  --primary: var(--brand-primary);
  --primary-foreground: var(--white);
  --secondary: #1F1F1F;
  --secondary-foreground: var(--text-primary);
  --accent: #2A1712;
  --accent-foreground: #FFB29F;
}
```

---

## 8. 组件 Token

组件层建议进一步独立，例如：

```css
:root,
[data-theme="light"] {
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primary-foreground);
  --button-secondary-bg: var(--secondary);
  --button-secondary-fg: var(--secondary-foreground);
  --card-border: var(--border-color);
  --dialog-bg: var(--card-bg);
  --dialog-border: var(--border-color);
}

[data-theme="dark"] {
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primary-foreground);
  --button-secondary-bg: var(--secondary);
  --button-secondary-fg: var(--secondary-foreground);
  --card-border: var(--border-color);
  --dialog-bg: var(--card-bg);
  --dialog-border: var(--border-color);
}
```

建议至少覆盖：

- button
- card
- input
- dialog
- popover
- table
- badge
- tabs
- chart
- nav

### 8.1 示例代码：Button / Card 组件 Token 映射

```css
:root,
[data-theme="light"] {
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primary-foreground);
  --button-primary-hover: #d94827;
  --button-secondary-bg: var(--secondary);
  --button-secondary-fg: var(--secondary-foreground);

  --card-bg: #ffffff;
  --card-fg: var(--foreground);
  --card-border: var(--border-color);
}

[data-theme="dark"] {
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primary-foreground);
  --button-primary-hover: #ff6a45;
  --button-secondary-bg: var(--secondary);
  --button-secondary-fg: var(--secondary-foreground);

  --card-bg: var(--card);
  --card-fg: var(--foreground);
  --card-border: var(--border-color);
}
```

```tsx
export function MarketingCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border bg-[var(--card-bg)] p-6 text-[var(--card-fg)]">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
    </div>
  )
}
```

---

## 9. 视觉规范

### 9.1 色彩使用原则

- 主背景必须克制干净
- 品牌色只承担重点强调，不用于泛滥装饰
- 浅色模式强调清晰与呼吸感
- 深色模式强调层次与表面关系
- 状态色需要做语义化收口，不要项目里到处出现不同版本

### 9.2 边框与层次

- 优先用边框、表面色差、轻微阴影建立层次
- 深色模式中，不依赖大面积浓阴影
- 卡片、弹层、表格、分区都要有统一边框策略

### 9.3 圆角系统

建议统一圆角级别：

- 4px：细小交互元素
- 8px：输入框、小型面板
- 12px：卡片、弹层
- 16px：主要卡片、图像容器
- 9999px：胶囊按钮、标签、状态 pill

### 9.4 排版系统

建议至少定义：

- Display / Hero
- H1 / H2 / H3
- Body Large
- Body
- Caption
- Small
- Mono

正文优先保证可读性，品牌感通过标题和布局体现。

---

## 10. shadcn/ui 工程规范

### 10.1 总原则

1. 先用已有组件，不要先写 div 模拟组件
2. 优先组合已有能力，不重复造轮子
3. 优先使用语义 Token，不写死颜色
4. 组件结构要遵循官方组合规则

### 10.2 常用规则

- 用 `gap-*`，不要用 `space-x-*` / `space-y-*`
- 等宽高优先 `size-*`
- 文本截断优先 `truncate`
- 条件类名用 `cn()`
- 不手写 overlay 组件的 z-index
- 不在 `className` 里强行覆盖组件本身的设计语义

### 10.3 表单规则

- 表单布局优先使用结构化 Field 方案
- 校验状态要统一标记
- 多个选项优先 `ToggleGroup`
- 输入框、说明、错误提示要有一致层级

### 10.4 组件结构规则

- `TabsTrigger` 必须在 `TabsList` 内
- `Dialog / Sheet / Drawer` 必须有 Title
- `Avatar` 必须有 `AvatarFallback`
- `Card` 尽量使用完整结构：Header / Content / Footer

### 10.5 组件选型建议

- 提示块：`Alert`
- 空状态：`Empty`
- 分隔线：`Separator`
- 骨架屏：`Skeleton`
- 标签：`Badge`
- 通知：`sonner`
- 图表：优先统一 Chart 封装

### 10.6 CLI 工作流建议

- 新增组件前先确认项目上下文
- 先查 docs，再写代码
- 更新组件优先 `--dry-run` 和 `--diff`
- 不要直接粗暴覆盖本地已改组件

### 10.7 示例代码：符合规范的 shadcn 表单片段

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileForm() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">名称</Label>
          <Input id="name" placeholder="请输入名称" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">邮箱</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button>保存修改</Button>
      </CardFooter>
    </Card>
  )
}
```

### 10.8 示例代码：主题切换组件

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system")

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode | null) ?? "system"
    setTheme(saved)
    applyTheme(saved)
  }, [])

  function applyTheme(mode: ThemeMode) {
    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode
    root.setAttribute("data-theme", resolved)
    localStorage.setItem("theme", mode)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex h-10 items-center gap-2 rounded-full border px-4"
        onClick={() => {
          const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
          setTheme(next)
          applyTheme(next)
        }}
      >
        {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        <span>{theme}</span>
      </button>
    </div>
  )
}
```

---

## 11. 页面级统一规则

### 11.1 页面层级顺序

建议统一为：

1. 页面背景层
2. 结构容器层
3. 分区标题层
4. 内容卡片层
5. 强调交互层
6. 浮层 / 提示层

### 11.2 页面节奏

- 大标题区域要有明确留白
- 分区之间要有可感知的呼吸距离
- 页面不能所有模块都同密度
- 重点区域可放大，普通区域克制

### 11.3 营销页 / Dashboard 区别

- 营销页强调视觉节奏、品牌表达、动画层次
- Dashboard 强调效率、密度、清晰信息结构
- 两者共用同一套主题与组件系统，但页面节奏不同

---

## 12. 动画模块（统一版）

动画模块把 GSAP 的“控制型动画能力”和 React Bits 的“创意组件型动画能力”统一为一个分层体系。

### 12.1 动画分层

1. **微交互层**  
   hover、press、focus、toggle、tab 切换

2. **组件层**  
   card reveal、accordion、dialog、popover、counter

3. **页面层**  
   hero timeline、section reveal、scroll-driven motion

4. **氛围层**  
   background glow、grid motion、marquee、ambient effects

### 12.2 动画原则

- 默认克制
- 优先服务于理解
- 不用动画掩盖结构问题
- 动画必须支持中断、卸载和降级
- 复杂动画优先 GSAP timeline
- 创意展示组件可借鉴 React Bits 风格，但要收口到统一节奏

### 12.3 动画 Token

建议定义：

```css
:root {
  --motion-duration-fast: 120ms;
  --motion-duration-base: 240ms;
  --motion-duration-slow: 480ms;
  --motion-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --motion-ease-emphasis: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-stagger-sm: 40ms;
  --motion-stagger-md: 80ms;
}
```

### 12.4 推荐动画模板包

#### `motion-tokens.css`
负责统一动画时长、缓动、节奏、强弱与降级规则。

#### `gsap-utils.ts`
负责封装常用 GSAP 工具函数，例如：

- `fadeInUp`
- `staggerReveal`
- `createHeroTimeline`
- `createScrollReveal`
- `safeGsapContext`

#### `hero-reveal.tsx`
负责首页 Hero 区动画模板，例如：

- 标题逐行进入
- 副标题错峰淡入
- CTA 出现
- 背景轻微氛围动画

#### `scroll-reveal.tsx`
负责滚动进入模板，例如：

- fade-up
- stagger cards
- section reveal
- image/text 分段进入

### 12.5 动画使用建议

- 官网 / Landing Page：可适度增强 Hero 与分区 reveal
- Dashboard：动画更轻，优先状态反馈
- Mobile：缩短时长，减少重位移与复杂滚动动画
- 低性能设备：关闭重 blur / 重 parallax / 长时间线

### 12.6 示例代码：motion-tokens.css

```css
:root {
  --motion-duration-fast: 120ms;
  --motion-duration-base: 240ms;
  --motion-duration-slow: 480ms;
  --motion-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --motion-ease-emphasis: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-stagger-sm: 40ms;
  --motion-stagger-md: 80ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-fast: 1ms;
    --motion-duration-base: 1ms;
    --motion-duration-slow: 1ms;
    --motion-stagger-sm: 0ms;
    --motion-stagger-md: 0ms;
  }
}
```

### 12.7 示例代码：gsap-utils.ts

```ts
import gsap from "gsap"

type RevealOptions = {
  y?: number
  duration?: number
  delay?: number
}

export function fadeInUp(target: gsap.TweenTarget, options: RevealOptions = {}) {
  const { y = 24, duration = 0.6, delay = 0 } = options

  return gsap.fromTo(
    target,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
    }
  )
}

export function staggerReveal(targets: gsap.TweenTarget, options: RevealOptions = {}) {
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: options.y ?? 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: options.duration ?? 0.6,
      delay: options.delay ?? 0,
      stagger: 0.08,
      ease: "power3.out",
    }
  )
}
```

### 12.8 示例代码：hero-reveal.tsx

```tsx
"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

export function HeroReveal() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from(".hero-kicker", {
        autoAlpha: 0,
        y: 16,
        duration: 0.4,
        ease: "power2.out",
      })
        .from(
          ".hero-title-line",
          {
            autoAlpha: 0,
            y: 36,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.15"
        )
        .from(
          ".hero-desc",
          {
            autoAlpha: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          ".hero-actions > *",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.2"
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="mx-auto max-w-6xl px-6 py-24">
      <p className="hero-kicker text-sm text-muted-foreground">统一设计与工程系统</p>
      <h1 className="mt-4 text-5xl font-semibold leading-tight">
        <span className="hero-title-line block">让前端风格更统一</span>
        <span className="hero-title-line block">让组件与动画可维护</span>
      </h1>
      <p className="hero-desc mt-6 max-w-2xl text-base text-muted-foreground">
        用同一套 token、组件、动画和多端适配规范支撑官网、后台和移动端。
      </p>
      <div className="hero-actions mt-8 flex gap-3">
        <button className="rounded-full border px-5 py-3">开始使用</button>
        <button className="rounded-full border px-5 py-3">查看文档</button>
      </div>
    </section>
  )
}
```

### 12.9 示例代码：scroll-reveal.tsx

```tsx
"use client"

import { useEffect, useRef } from "react"

export function ScrollReveal({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // 检查 prefers-reduced-motion，直接显示不做动画
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      node.dataset.visible = "true"
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 用 data-visible 驱动样式，而非 is-visible class
          // （Tailwind 没有内置 is-visible: 变体，data-[visible=true]: 是正确写法）
          node.dataset.visible = "true"
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-visible="false"
      className={[
        // 初始状态：透明 + 向下偏移
        "translate-y-6 opacity-0",
        // data-visible=true 时：归位 + 显示（Tailwind data-* 变体，正确可用）
        "transition-all duration-700 ease-out",
        "data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
```

---

## 13. 多端适配模块

多端适配不是只做断点，而是一套同时覆盖**平台、布局、交互、尺寸、组件行为、动画降级**的规范。

### 13.1 平台分层

建议至少区分：

- Desktop Web
- Tablet
- Mobile Web / H5
- PWA
- Native App
- Desktop App

### 13.2 适配原则

1. 一套设计语言，多端表达差异化
2. 一套 Token，多端组件行为可变形
3. 适配的不只是尺寸，还包括交互逻辑
4. 移动端不是缩小桌面端，平板不是放大手机端

### 13.3 布局尺寸规范

建议增加如下 Token：

```css
:root {
  --bp-mobile-sm: 360px;
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-laptop: 1024px;
  --bp-desktop: 1280px;
  --bp-wide: 1440px;
  --bp-ultra: 1920px;

  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 32rem;
  --container-lg: 48rem;
  --container-xl: 72rem;
  --container-2xl: 80rem;
}
```

布局要求：

- Mobile：单列优先
- Tablet：双列或主从结构
- Desktop：多列增强
- Wide：限制最大内容宽度，避免内容发散

### 13.4 交互逻辑规范

#### Desktop 交互

适合：

- hover
- dropdown / popover
- sidebar
- 表格与复杂筛选
- command palette
- 键盘快捷键

#### Mobile 交互

适合：

- tap
- bottom sheet
- fullscreen sheet
- 单列流程
- 大尺寸 CTA
- 底部导航
- 手势驱动

#### Tablet 交互

适合：

- 双栏布局
- master-detail
- touch 为主但信息密度高于手机
- 局部引入桌面增强交互

### 13.5 尺寸与触达规范

建议写成硬规则：

- Icon Button 触达区不小于 44
- 普通按钮高度：44–52
- 列表项高度：44–56
- 表单控件高度：44–52
- 底部导航项高度：48+
- 主要 CTA 在移动端保持更高触达面积

文字建议：

- 移动端正文不低于 14px
- 小字说明尽量不低于 12px
- 重要交互标签优先 14–16px

### 13.6 多端组件行为矩阵

#### Navigation
- Desktop：Top Nav / Sidebar
- Tablet：Top Nav + 可折叠侧栏
- Mobile：Bottom Nav / Drawer / Hamburger

#### Dialog
- Desktop：Centered Modal
- Tablet：Modal / Side Sheet
- Mobile：Bottom Sheet / Fullscreen Sheet

#### Table
- Desktop：标准表格
- Tablet：精简列 / 横向滚动
- Mobile：Card List / Collapse Rows

#### Filter
- Desktop：Inline Toolbar
- Mobile：Drawer Filter Panel

#### Search
- Desktop：Popover / Command Palette
- Mobile：Fullscreen Search Sheet

#### Form
- Desktop：多列可接受
- Mobile：单列、分步、强 CTA

### 13.7 多端动画策略

- Desktop：允许更丰富的 hover 与 reveal
- Mobile：更短、更轻、更明确
- 低性能设备：关闭重效果
- `prefers-reduced-motion` 必须统一降级

### 13.8 多端技术路线建议

#### Web-first
- Next.js + shadcn/ui + 统一 Token

#### Web 打包 App
- React / Next.js + Capacitor

#### Mobile-first
- Expo / React Native + 统一设计资产

#### Desktop-first
- Tauri + 现有前端技术栈

### 13.9 示例代码：多端自适应布局容器

```tsx
export function AdaptiveContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--container-xl)] px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
```

### 13.10 示例代码：use-device.ts

```ts
"use client"

import { useEffect, useState } from "react"

type DeviceType = "mobile" | "tablet" | "desktop"

function resolveDevice(width: number): DeviceType {
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

export function useDevice() {
  const [device, setDevice] = useState<DeviceType>("desktop")

  useEffect(() => {
    const update = () => setDevice(resolveDevice(window.innerWidth))
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return device
}
```

### 13.11 示例代码：adaptive-dialog.tsx

```tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useDevice } from "@/lib/use-device"

export function AdaptiveDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}) {
  const device = useDevice()

  if (device === "mobile") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

### 13.12 示例代码：移动端表格降级为卡片列表

```tsx
type Order = {
  id: string
  customer: string
  status: string
  amount: string
}

export function OrdersAdaptiveList({
  items,
  mobile = false,
}: {
  items: Order[]
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.customer}</span>
              <span className="text-sm text-muted-foreground">{item.status}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">订单号：{item.id}</div>
            <div className="mt-1 text-base font-semibold">{item.amount}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-3 text-left">订单号</th>
          <th className="px-4 py-3 text-left">客户</th>
          <th className="px-4 py-3 text-left">状态</th>
          <th className="px-4 py-3 text-left">金额</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b">
            <td className="px-4 py-3">{item.id}</td>
            <td className="px-4 py-3">{item.customer}</td>
            <td className="px-4 py-3">{item.status}</td>
            <td className="px-4 py-3">{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 14. 可扩展模块

为了保证这份 Skill 后续可以不断扩展，建议预留独立模块区。

### 14.1 可扩展主题模块

未来可新增：

- 高对比主题
- 品牌子主题
- 节日主题
- 活动营销主题
- 行业定制主题

### 14.2 可扩展动画模块

未来可新增：

- text reveal
- marquee
- magnetic button
- parallax scene
- number counter
- background particle system

### 14.3 可扩展多端模块

未来可新增：

- 大屏展示端
- TV 端
- 小程序端
- Kiosk 模式
- 多窗口桌面模式
- 离线优先能力

### 14.4 可扩展业务模块

未来可新增：

- 电商模块
- 内容平台模块
- AI 工具模块
- 数据分析模块
- 企业后台模块

---

## 15. 推荐目录结构

### 15.1 前端独立项目

```txt
frontend-system/
├─ docs/
│  ├─ frontend-unified-skill-ultimate-zh.md
│  ├─ shadcn-theme-mapping.md
│  └─ motion-guidelines.md
├─ styles/
│  ├─ theme.css
│  ├─ motion-tokens.css
│  └─ adaptive-tokens.css
├─ components/
│  ├─ theme-toggle.tsx
│  ├─ adaptive-dialog.tsx
│  ├─ hero-reveal.tsx
│  └─ scroll-reveal.tsx
├─ lib/
│  ├─ theme-provider.tsx
│  ├─ gsap-utils.ts
│  └─ use-device.ts
└─ app/
   ├─ layout.tsx
   └─ page.tsx
```

### 15.2 全栈项目（workstation-energy-center 标准）

详见第 18 章「项目创建模块」，此处仅列顶层结构：

```txt
{项目名}/
├─ frontend/          ← Next.js + shadcn/ui + 本 Skill 所有前端规范
├─ backend/           ← Node.js + Express + Prisma
├─ docker-compose.yml
└─ README.md
```

---

## 16. 给前端工程师的落地建议

### 16.0 示例代码：推荐的 globals.css 起步模板

```css
@import "./theme.css";
@import "./motion-tokens.css";
@import "./adaptive-tokens.css";

@layer base {
  * {
    border-color: var(--border-color);
  }

  html,
  body {
    min-height: 100%;
  }

  body {
    background: var(--background);
    color: var(--foreground);
    text-rendering: optimizeLegibility;
  }
}
```

### 16.1 示例代码：Next.js layout 接入方式（含 SSR 防闪烁）

SSR 环境下，如果主题状态仅存在于客户端 `localStorage`，hydration 阶段会短暂出现"错误主题闪烁"（FOUC）。解决方案是在 `<head>` 中注入一段内联 script，在页面渲染前同步读取并设置 `data-theme`。

```tsx
// app/layout.tsx
import "./globals.css"

// 这段 script 会在 HTML 渲染完成前同步执行，避免主题闪烁
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme')
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    var resolved = saved === 'dark' || saved === 'light'
      ? saved
      : prefersDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', resolved)
  } catch (e) {}
})()
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning 是必须的：data-theme 由客户端 script 注入，
    // 与服务端渲染的初始值可能不同，suppres 可避免 React hydration 警告
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

同时更新 `ThemeToggle` 的初始状态读取，确保与 script 逻辑一致：

```tsx
// 原来：useState<ThemeMode>("system")  ← 会在 hydration 时与实际 DOM 不一致
// 修复后：延迟读取 localStorage，避免 SSR/CSR 不一致

"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

export function ThemeToggle() {
  // 初始值使用 undefined，避免 SSR hydration 错误
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined)

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode | null) ?? "system"
    setTheme(saved)
  }, [])

  function applyTheme(mode: ThemeMode) {
    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode
    root.setAttribute("data-theme", resolved)
    localStorage.setItem("theme", mode)
    setTheme(mode)
  }

  // hydration 完成前不渲染，避免图标闪烁
  if (theme === undefined) return <div className="size-10" />

  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm"
      onClick={() => {
        const next: ThemeMode =
          theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
        applyTheme(next)
      }}
      aria-label="切换主题"
    >
      {theme === "dark" ? (
        <Moon className="size-4" />
      ) : theme === "system" ? (
        <Monitor className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
      <span className="capitalize">{theme}</span>
    </button>
  )
}
```

### 16.2 示例代码：页面级组合示例

```tsx
import { HeroReveal } from "@/components/hero-reveal"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="text-sm font-semibold">Frontend Unified Skill</div>
        <ThemeToggle />
      </header>

      <HeroReveal />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {["主题系统", "动画模块", "多端适配"].map((title) => (
          <ScrollReveal key={title}>
            <div className="rounded-2xl border bg-[var(--card-bg)] p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                统一 token、组件结构与交互逻辑，提升设计一致性和工程可维护性。
              </p>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </main>
  )
}
```

### 16.3 建项目时先做这几件事

1. 先建立 theme token
2. 再建立 semantic token 映射
3. 再接入 shadcn/ui
4. 再补动画 token 和基础工具层
5. 最后再做多端组件行为适配

### 16.4 不要这样做

- 不要一边写页面一边临时定设计规则
- 不要组件里到处硬编码颜色
- 不要所有页面各自写一套动画节奏
- 不要把多端适配理解成“缩放一下布局”
- 不要到了后期才补主题结构

### 16.5 推荐实施顺序

#### 第一阶段
- theme.css
- shadcn 基础组件
- Button / Card / Input / Dialog 统一

#### 第二阶段
- Dashboard / Landing Page 页面模板
- motion-tokens.css
- 基础 reveal 组件

#### 第三阶段
- 多端行为矩阵落地
- adaptive tokens
- use-device / adaptive-dialog / adaptive-table

#### 第四阶段
- 扩展主题
- 扩展动画
- 桌面端 / App 端适配

---

## 17. 一句话总结

这份统一 Skill 的目标不是让项目“看起来还行”，而是让前端工程师能基于一套**统一、可扩展、可维护、可跨端演进**的规则持续开发。

它统一了六件事：

- 设计语言
- 深浅主题
- shadcn/ui 工程规范
- 动画模块
- 多端适配能力
- **全栈项目创建规范**（第 18 章）

最终结果应该是：

**同一套系统，能支撑品牌官网、产品后台、移动端体验，以及未来的 App / Desktop 扩展。从第一行代码开始，就有结构、有规范、可运行。**

## 18. 项目创建模块

> 本章定义从零创建一个**前后端分离全栈 TypeScript 项目**的完整标准，以 `workstation-energy-center` 为基准，结构规范、开箱可运行。适用于所有基于本 Skill 的新项目。

---

### 18.1 创建前确认清单

开始创建前，先明确以下信息（用户已提供则跳过）：

| 项目 | 默认值 | 说明 |
|------|--------|------|
| 项目名称 | `workstation-energy-center` | 影响目录名和 package.json |
| 品牌色 | `#EC5331` | 写入 `globals.css` 的 `--brand-primary` |
| 数据库名 | 与项目名一致 | 写入 `backend/.env.local` |
| 功能模块 | 全部（status / cards / translator / comfort / config） | 决定 routes、controllers、pages/admin 的文件数量 |

---

### 18.2 标准目录结构

按以下结构创建，**不要遗漏任何层级**：

```
{项目名}/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.local
│   ├── .env.production
│   ├── public/images/
│   ├── styles/
│   │   ├── globals.css          ← 主题 Token 入口（参照本 Skill 第 6–8 章）
│   │   └── tailwind.css
│   ├── lib/
│   │   ├── gsapUtils.ts         ← 参照本 Skill 第 12 章
│   │   ├── reactBitsUtils.ts
│   │   └── apiClient.ts         ← 统一封装所有后端请求
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useStatus.ts
│   │   ├── useTranslator.ts
│   │   └── useComfort.ts
│   ├── components/
│   │   ├── ui/                  ← 基础 UI 组件（无业务逻辑）
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/              ← 全局结构组件
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/            ← 业务功能组件
│   │       ├── StatusSign.tsx
│   │       ├── Countdown.tsx
│   │       ├── Translator.tsx
│   │       ├── ComfortBox.tsx
│   │       └── FeaturedCards.tsx
│   └── pages/
│       ├── _app.tsx             ← 含 SSR 防闪烁 script（参照本 Skill 16.1）
│       ├── index.tsx
│       ├── blackwords.tsx
│       ├── comfort.tsx
│       ├── about.tsx
│       └── admin/
│           ├── page.tsx
│           ├── statusManager.tsx
│           ├── cardsManager.tsx
│           ├── translatorManager.tsx
│           └── comfortManager.tsx
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local
│   ├── .env.production
│   └── src/
│       ├── server.ts            ← 启动入口，加载 .env.local
│       ├── app.ts               ← Express 初始化、路由注册、errorHandler
│       ├── routes/              ← 只做路径定义，逻辑在 controller
│       │   ├── status.ts
│       │   ├── cards.ts
│       │   ├── translator.ts
│       │   ├── comfort.ts
│       │   └── config.ts
│       ├── controllers/         ← 请求处理，调用 service，异常向上 throw
│       │   ├── statusController.ts
│       │   ├── cardsController.ts
│       │   ├── translatorController.ts
│       │   ├── comfortController.ts
│       │   └── configController.ts
│       ├── services/
│       │   └── dbService.ts     ← 所有 Prisma 操作集中在此
│       ├── middleware/
│       │   └── errorHandler.ts  ← 统一异常处理，不在 controller 里逐行 try/catch
│       └── utils/
│           └── gsapUtils.ts
│   └── prisma/
│       ├── schema.prisma        ← 含 Status / Card / Translator / Comfort / Config
│       └── seed.ts
├── docker-compose.yml
└── README.md
```

---

### 18.3 关键文件约定

**前端必须包含实际内容的文件：**

| 文件 | 要求 |
|------|------|
| `frontend/styles/globals.css` | 完整三层 Token（参照本 Skill 第 6–8 章） |
| `frontend/pages/_app.tsx` | 含 SSR 防主题闪烁 script（参照本 Skill 16.1） |
| `frontend/lib/apiClient.ts` | 封装 fetch，含 baseURL 和统一错误处理 |
| `frontend/lib/gsapUtils.ts` | 含 fadeInUp / staggerReveal / createScrollReveal |
| `frontend/next.config.js` | 含 API rewrite 到后端 |
| `frontend/.env.local` | `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` |

**后端必须包含实际内容的文件：**

| 文件 | 要求 |
|------|------|
| `backend/src/server.ts` | 加载 dotenv，启动 Express |
| `backend/src/app.ts` | 注册所有路由，挂载 errorHandler（必须在路由之后） |
| `backend/src/middleware/errorHandler.ts` | 统一 500 处理，打印 err.message |
| `backend/prisma/schema.prisma` | 含全部 5 个 model |
| `backend/prisma/seed.ts` | 含初始数据，可直接 `npx prisma db seed` 运行 |
| `backend/.env.local` | 含 PORT 和 DATABASE_URL |

---

### 18.4 命名约定

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `StatusSign.tsx` |
| Hook 文件 | camelCase，`use` 前缀 | `useStatus.ts` |
| 工具 / 服务 | camelCase | `apiClient.ts`、`dbService.ts` |
| 路由 / Controller | camelCase | `statusController.ts` |
| CSS 变量 | kebab-case，语义命名 | `--brand-primary`、`--card-bg` |

---

### 18.5 初始化命令

文件创建完成后，按以下顺序执行：

```bash
# ── 方式 A：本地开发 ──

# 1. 前端依赖
cd frontend && npm install

# 2. 后端依赖
cd ../backend && npm install

# 3. 初始化数据库（需先启动 PostgreSQL）
npx prisma migrate dev --name init
npx prisma db seed

# 4. 分终端启动
cd ../frontend && npm run dev      # → http://localhost:3000
cd ../backend  && npm run dev      # → http://localhost:4000

# ── 方式 B：Docker 一键启动 ──
cd {项目名} && docker-compose up --build
# 前端 → http://localhost:3000
# 后端 → http://localhost:4000
```

---

### 18.6 前端与本 Skill 的衔接关系

项目创建后，`frontend/` 目录内的所有开发必须遵循本文档已有规范：

| 本 Skill 章节 | 在项目中的对应位置 |
|---------------|-------------------|
| 第 6–8 章：主题 Token | `frontend/styles/globals.css` |
| 第 10 章：shadcn/ui 规范 | `frontend/components/ui/` |
| 第 12 章：动画模块 | `frontend/lib/gsapUtils.ts`、`frontend/components/features/` |
| 第 13 章：多端适配 | `frontend/lib/use-device.ts`、`frontend/components/` |
| 第 16.1 节：SSR 防闪烁 | `frontend/pages/_app.tsx` |

---

### 18.7 常见问题

**只需要前端：** 只创建 `frontend/` 目录，跳过 `backend/` 和 `docker-compose.yml`。

**只需要后端：** 只创建 `backend/` 目录，跳过 `frontend/`。

**需要修改模块列表：** 根据用户的模块名，同步修改 `routes/`、`controllers/`、`pages/admin/` 下的文件，保持命名一致，不要出现孤立文件。

**需要修改技术栈：** 替换 `package.json` 中的依赖，更新对应配置文件，但保持目录分层结构不变。
