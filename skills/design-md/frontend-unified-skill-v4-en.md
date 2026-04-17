# Frontend Unified Skill (Ultimate Edition v4)

> A unified skill document for frontend engineers, integrating design systems, theme architecture, shadcn/ui engineering standards, animation modules, multi-platform adaptation, and full-stack project scaffolding.
>
> **v4 Update:** Added Chapter 18 “Project Scaffold Module” — a complete workstation-energy-center full-stack scaffold spec covering directory structure, key file conventions, naming rules, and initialization flow.  
> **v3 Update:** Fixed scroll-reveal Tailwind variant bug, added SSR anti-FOUC theme solution, corrected chapter numbering, added visual aesthetic reference section.

---

## 1. Document Goals

This Skill addresses the five most common sources of fragmentation in frontend projects:

- Inconsistent visual style
- Unsystematic light/dark theme switching
- Non-standard usage of shadcn/ui components
- Scattered, unmaintainable animation effects
- Multi-platform adaptation limited to breakpoints, lacking interaction logic and size standards

It is neither a pure design spec nor a pure code standard — it is a **unified standard that frontend engineers can directly implement**.

Applicable contexts:

- Brand websites
- SaaS landing pages
- AI product pages
- Admin dashboards
- Dashboard
- H5 / Mobile Web
- Frontend projects that may later extend to App / Desktop

---

## 2. Core Positioning

This unified Skill aims to give every project:

- Polish and design consistency
- Engineering maintainability
- Extensible light/dark theming
- Standardized component system
- Controllable and gracefully degradable animations
- Multi-platform layout, interaction, and size adaptation

This is a systematic frontend approach from **Token → Component → Page → Animation → Multi-platform Adaptation**.

---

## 3. Core Principles

### 3.1 Design Principles

1. **Strong contrast, but not noise**  
   Establish order through light/dark contrast, hierarchy, whitespace, and typographic weight — not decoration.

2. **Whitespace is part of the structure**  
   Empty space is not waste — it gives pages rhythm and a sense of quality.

3. **Typography over decoration**  
   Use font size, weight, line height, and letter spacing to solve hierarchy problems first.

4. **Borders are more stable than heavy shadows**  
   Especially in dark themes, prefer borders and surface contrast to establish depth.

5. **Animation serves comprehension, not show**  
   Animations should help users perceive structure, state, and rhythm — not create distraction.

### 3.2 Engineering Principles

1. Use semantic tokens — never hardcode raw color values
2. Use existing components first — don't reinvent the wheel
3. Prefer composition over style overrides
4. Build theme extensibility in from day one
5. Animations must support graceful degradation and reuse
6. Multi-platform adaptation is more than responsive — it includes interaction and component behavior differences

---

## 4. Design Language

### 4.1 Overall Aesthetic

The unified style combines:

- Resend's refined, restrained, cinematic visual expression
- shadcn/ui's component-driven engineering capability
- A clearer light/dark theme mechanism
- Unified rules better suited to product-level implementation

### 4.2 Keywords

Recommended keywords for the overall style:

- Premium
- Modern
- Calm
- Precise
- Technical
- Restrained
- Unified
- Brand-aware

Avoid:

- Overly flashy
- Excessive glow effects
- Color chaos
- Element overload
- Unrestrained decorative design

### 4.3 Aesthetic Reference Benchmarks

Good design cannot be described in words alone. These are reference points for aligning your team's aesthetic standards:

**✅ On-target references (worth learning from)**

| Site | What to learn |
|---|---|
| [resend.com](https://resend.com) | Extremely restrained dark site — type hierarchy, whitespace rhythm, brand color usage |
| [vercel.com](https://vercel.com) | Black-and-white technical aesthetic, charts and animations integrated into page structure |
| [linear.app](https://linear.app) | High information density without chaos — the gold standard for dark dashboards |
| [raycast.com](https://raycast.com) | Gradient atmosphere combined with product screenshots — premium feel from detail |
| [ui.shadcn.com](https://ui.shadcn.com) | Information structure of component docs — lightweight but precise |

**❌ Common pitfalls to actively avoid**

| Problem | Typical symptom |
|---|---|
| Generic AI look | Purple gradient background + Inter font + cookie-cutter card layouts |
| Over-decoration | Every section has glow halos, noise textures, and glassmorphism |
| Color overuse | Brand color appears in 10+ places with no hierarchy |
| Hierarchy chaos | All elements have similar visual weight — no clear focal point |
| Animation interference | Animations finish or loop before the user has finished reading |

**The 3-second test:** If a screenshot of the page can't answer "what does this product do and where's the focus" within 3 seconds, the information hierarchy has a problem.

---

## 5. Theme System

### 5.1 Theme Modes

Must support three theme states:

- `light`
- `dark`
- `system`

### 5.2 Theme Layer Architecture

All themes must follow a three-layer structure:

1. **Atomic Tokens**  
   Raw primitive values: colors, border radii, shadows, spacing, durations

2. **Semantic Tokens**  
   Values with functional meaning: background, text, border, brand color, success, warning

3. **Component Tokens**  
   Component-specific values: Button, Card, Input, Dialog, Badge, Chart

Benefits of this approach:

- Changing brand color doesn't require rewriting components
- High-contrast themes can be added later
- Campaign themes / product-line themes can be added
- A/B theme variants are possible

---

## 6. Light/Dark Base Tokens

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

### 6.3 Base Requirements

- These tokens form the theme foundation and can be overridden by extended themes
- New themes must maintain semantic consistency — don't just copy scattered color values
- When modifying themes, change tokens first — never modify component implementations directly

### 6.4 Example: Complete Theme Base File

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

## 7. Semantic Token Mapping

Map base tokens to semantic tokens that are actually used throughout the project:

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

## 8. Component Tokens

The component layer should be further isolated, for example:

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

Recommended minimum coverage:

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

### 8.1 Example: Button / Card Component Token Mapping

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

## 9. Visual Standards

### 9.1 Color Usage Principles

- Main backgrounds must be restrained and clean
- Brand color serves emphasis only — not decorative overuse
- Light mode emphasizes clarity and breathing room
- Dark mode emphasizes depth and surface relationships
- Status colors must be semantically centralized — no scattered one-offs across the project

### 9.2 Borders and Depth

- Prefer borders, surface color contrast, and subtle shadows for depth
- In dark mode, avoid heavy large-area shadows
- Cards, overlays, tables, and sections must follow a unified border strategy

### 9.3 Border Radius System

Recommended unified border radius scale:

- 4px: small interactive elements
- 8px: inputs, small panels
- 12px: cards, overlays
- 16px: primary cards, image containers
- 9999px: pill buttons, tags, status pills

### 9.4 Typography System

Define at minimum:

- Display / Hero
- H1 / H2 / H3
- Body Large
- Body
- Caption
- Small
- Mono

Body text prioritizes readability; brand identity is expressed through headings and layout.

---

## 10. shadcn/ui Engineering Standards

### 10.1 General Principles

1. Use existing components first — don't reach for a div to simulate one
2. Compose existing capabilities — don't reinvent the wheel
3. Use semantic tokens — never hardcode colors
4. Follow official composition rules for component structure

### 10.2 Common Rules

- Use `gap-*`, not `space-x-*` / `space-y-*`
- Use `size-*` for equal width/height
- Use `truncate` for text overflow
- Use `cn()` for conditional class names
- Don't manually write z-index for overlay components
- Don't force-override a component's design semantics via `className`

### 10.3 Form Rules

- Use a structured Field approach for form layouts
- Validation states must be uniformly marked
- Use `ToggleGroup` for multiple-choice options
- Inputs, descriptions, and error messages must maintain consistent hierarchy

### 10.4 Component Structure Rules

- `TabsTrigger` must be inside `TabsList`
- `Dialog / Sheet / Drawer` must have a Title
- `Avatar` must have `AvatarFallback`
- `Card` should use the full structure: Header / Content / Footer

### 10.5 Component Selection Guide

- Alert blocks: `Alert`
- Empty states: `Empty`
- Dividers: `Separator`
- Skeleton loaders: `Skeleton`
- Tags/labels: `Badge`
- Notifications: `sonner`
- Charts: use a unified Chart wrapper

### 10.6 CLI Workflow Recommendations

- Confirm project context before adding components
- Check docs first, then write code
- When updating, use `--dry-run` and `--diff` first
- Never blindly overwrite locally modified components

### 10.7 Example: Compliant shadcn Form

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileForm() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter name" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
```

### 10.8 Example: Theme Toggle Component

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

## 11. Page-Level Unified Rules

### 11.1 Page Layer Order

Recommended unified order:

1. Page background layer
2. Structural container layer
3. Section heading layer
4. Content card layer
5. Emphasis / interaction layer
6. Overlay / tooltip layer

### 11.2 Page Rhythm

- Hero/headline areas must have clear whitespace
- Sections must have perceptible breathing room between them
- Not all modules on a page should have equal density
- Key areas can expand; supporting areas stay restrained

### 11.3 Marketing Page vs. Dashboard

- Marketing pages emphasize visual rhythm, brand expression, and animation layering
- Dashboards emphasize efficiency, density, and clear information structure
- Both share the same theme and component system, but their page rhythm differs

---

## 12. Animation Module (Unified)

The animation module unifies GSAP’s controlled animation capability with React Bits’ creative component animation capability into a layered system.

### 12.1 Animation Layers

1. **Micro-interaction layer**  
   hover, press, focus, toggle, tab switching

2. **Component layer**  
   card reveal, accordion, dialog, popover, counter

3. **Page layer**  
   hero timeline, section reveal, scroll-driven motion

4. **Ambient layer**  
   background glow, grid motion, marquee, ambient effects

### 12.2 Animation Principles

- Restrained by default
- Serve comprehension first
- Don't use animation to hide structural problems
- Animations must support interruption, unmounting, and degradation
- Use GSAP timeline for complex animations
- Creative showcase components can draw from React Bits style, but must conform to the unified timing rhythm

### 12.3 Animation Tokens

Define the following:

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

### 12.4 Recommended Animation Template Package

#### `motion-tokens.css`
Handles unified animation duration, easing, rhythm, intensity, and degradation rules.

#### `gsap-utils.ts`
Encapsulates common GSAP utility functions, such as:

- `fadeInUp`
- `staggerReveal`
- `createHeroTimeline`
- `createScrollReveal`
- `safeGsapContext`

#### `hero-reveal.tsx`
Hero section animation template, including:

- Title lines entering sequentially
- Subtitle staggered fade-in
- CTA appearance
- Subtle background ambient animation

#### `scroll-reveal.tsx`
Scroll-triggered reveal templates, including:

- fade-up
- stagger cards
- section reveal
- image/text segmented entry

### 12.5 Animation Usage Guidelines

- Website / Landing Page: moderate Hero and section reveal enhancements are appropriate
- Dashboard: lighter animations, prioritize state feedback
- Mobile: shorten duration, reduce heavy displacement and complex scroll animations
- Low-performance devices: disable heavy blur / heavy parallax / long timelines

### 12.6 Example: motion-tokens.css

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

### 12.7 Example: gsap-utils.ts

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

### 12.8 Example: hero-reveal.tsx

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
      <p className="hero-kicker text-sm text-muted-foreground">Unified Design & Engineering System</p>
      <h1 className="mt-4 text-5xl font-semibold leading-tight">
        <span className="hero-title-line block">Keep frontend styles unified</span>
        <span className="hero-title-line block">Keep components and animations maintainable</span>
      </h1>
      <p className="hero-desc mt-6 max-w-2xl text-base text-muted-foreground">
        One set of tokens, components, animations, and multi-platform rules supporting websites, backends, and mobile.
      </p>
      <div className="hero-actions mt-8 flex gap-3">
        <button className="rounded-full border px-5 py-3">Get Started</button>
        <button className="rounded-full border px-5 py-3">View Docs</button>
      </div>
    </section>
  )
}
```

### 12.9 Example: scroll-reveal.tsx

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

    // Check prefers-reduced-motion — skip animation and show immediately
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      node.dataset.visible = "true"
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Drive styles via data-visible, not is-visible class
          // (Tailwind has no built-in is-visible: variant; data-[visible=true]: is correct)
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
        // Initial state: transparent + shifted down
        "translate-y-6 opacity-0",
        // When data-visible=true: reset position + show (Tailwind data-* variant — correct usage)
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

## 13. Multi-Platform Adaptation Module

Multi-platform adaptation is not just about breakpoints — it is a spec covering **platform, layout, interaction, size, component behavior, and animation degradation**.

### 13.1 Platform Layers

Distinguish at minimum:

- Desktop Web
- Tablet
- Mobile Web / H5
- PWA
- Native App
- Desktop App

### 13.2 Adaptation Principles

1. One design language — differentiated expression per platform
2. One token set — component behavior adapts per platform
3. Adaptation covers more than size — it includes interaction logic
4. Mobile is not a shrunken desktop; tablet is not an enlarged phone

### 13.3 Layout Size Standards

Add the following tokens:

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

Layout requirements:

- Mobile: single-column first
- Tablet: two-column or master-detail
- Desktop: multi-column enhancement
- Wide: constrain max content width to prevent sprawl

### 13.4 Interaction Logic Standards

#### Desktop Interaction

Suitable for:

- hover
- dropdown / popover
- sidebar
- Tables and complex filters
- command palette
- Keyboard shortcuts

#### Mobile Interaction

Suitable for:

- tap
- bottom sheet
- fullscreen sheet
- Single-column flows
- Large CTA targets
- Bottom navigation
- Gesture-driven

#### Tablet Interaction

Suitable for:

- Two-column layout
- master-detail
- Touch-primary but higher information density than mobile
- Partially introduce desktop-enhanced interactions

### 13.5 Size and Touch Target Standards

Treat these as hard rules:

- Icon button touch target: minimum 44px
- Standard button height: 44–52px
- List item height: 44–56px
- Form control height: 44–52px
- Bottom nav item height: 48px+
- Primary CTAs on mobile must maintain larger touch areas

Typography guidelines:

- Mobile body text: minimum 14px
- Small/caption text: try to stay at 12px minimum
- Important interaction labels: prefer 14–16px

### 13.6 Multi-Platform Component Behavior Matrix

#### Navigation
- Desktop: Top Nav / Sidebar
- Tablet: Top Nav + collapsible sidebar
- Mobile: Bottom Nav / Drawer / Hamburger

#### Dialog
- Desktop: Centered Modal
- Tablet: Modal / Side Sheet
- Mobile: Bottom Sheet / Fullscreen Sheet

#### Table
- Desktop: Standard table
- Tablet: Reduced columns / horizontal scroll
- Mobile：Card List / Collapse Rows

#### Filter
- Desktop: Inline Toolbar
- Mobile: Drawer Filter Panel

#### Search
- Desktop: Popover / Command Palette
- Mobile: Fullscreen Search Sheet

#### Form
- Desktop: multi-column acceptable
- Mobile: single-column, stepped, strong CTA

### 13.7 Multi-Platform Animation Strategy

- Desktop: richer hover and reveal animations are appropriate
- Mobile: shorter, lighter, more direct
- Low-performance devices: disable heavy effects
- `prefers-reduced-motion` must be universally handled for degradation

### 13.8 Multi-Platform Technology Recommendations

#### Web-first
- Next.js + shadcn/ui + unified Tokens

#### Web-wrapped App
- React / Next.js + Capacitor

#### Mobile-first
- Expo / React Native + unified design assets

#### Desktop-first
- Tauri + existing frontend stack

### 13.9 Example: Multi-Platform Adaptive Layout Container

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

### 13.10 Example: use-device.ts

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

### 13.11 Example: adaptive-dialog.tsx

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

### 13.12 Example: Mobile Table Degraded to Card List

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
            <div className="mt-2 text-sm text-muted-foreground">Order: {item.id}</div>
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
          <th className="px-4 py-3 text-left">Order ID</th>
          <th className="px-4 py-3 text-left">Customer</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Amount</th>
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

## 14. Extensible Modules

To ensure this Skill can be continuously extended, reserve dedicated module areas.

### 14.1 Extensible Theme Modules

Can be added in the future:

- High-contrast theme
- Brand sub-theme
- Seasonal/holiday theme
- Campaign/event theme
- Industry-specific theme

### 14.2 Extensible Animation Modules

Can be added in the future:

- text reveal
- marquee
- magnetic button
- parallax scene
- number counter
- background particle system

### 14.3 Extensible Multi-Platform Modules

Can be added in the future:

- Large-screen display
- TV platform
- Mini-program platform
- Kiosk mode
- Multi-window desktop mode
- Offline-first capability

### 14.4 Extensible Business Modules

Can be added in the future:

- E-commerce module
- Content platform module
- AI tools module
- Data analytics module
- Enterprise admin module

---

## 15. Recommended Directory Structure

### 15.1 Frontend-Only Project

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

### 15.2 Full-Stack Project (workstation-energy-center Standard)

See Chapter 18 for details. Top-level structure only:

```txt
{project-name}/
├─ frontend/          ← Next.js + shadcn/ui + all frontend rules from this Skill
├─ backend/           ← Node.js + Express + Prisma
├─ docker-compose.yml
└─ README.md
```

---

## 16. Implementation Guide for Frontend Engineers

### 16.0 Example: Recommended globals.css Starter Template

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

### 16.1 Example: Next.js Layout Setup (with SSR Anti-FOUC)

In SSR environments, if theme state only exists in client-side `localStorage`, a brief Flash of Unstyled Content (FOUC) occurs during hydration. The solution is to inject an inline script in `<head>` that synchronously reads and sets `data-theme` before the page renders.

```tsx
// app/layout.tsx
import "./globals.css"

// This script executes synchronously before HTML renders, preventing theme flash
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
    // suppressHydrationWarning is required: data-theme is injected by the client script,
    // which may differ from the server-rendered value — this suppresses the React hydration warning
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Also update `ThemeToggle`'s initial state reading to stay consistent with the script logic:

```tsx
// Before: useState<ThemeMode>("system")  ← will mismatch the actual DOM during hydration
// Fixed: defer localStorage reading to avoid SSR/CSR mismatch

"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

export function ThemeToggle() {
  // Use undefined as initial value to avoid SSR hydration error
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

  // Don't render until hydration is complete, prevents icon flash
  if (theme === undefined) return <div className="size-10" />

  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm"
      onClick={() => {
        const next: ThemeMode =
          theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
        applyTheme(next)
      }}
      aria-label="Toggle theme"
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

### 16.2 Example: Page-Level Composition

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
        {["Theme System", "Animation", "Multi-Platform"].map((title) => (
          <ScrollReveal key={title}>
            <div className="rounded-2xl border bg-[var(--card-bg)] p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Unified tokens, component structure, and interaction logic — improving design consistency and engineering maintainability.
              </p>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </main>
  )
}
```

### 16.3 Do These First When Starting a Project

1. Establish theme tokens first
2. Set up semantic token mappings
3. Integrate shadcn/ui
4. Add animation tokens and base utility layer
5. Implement multi-platform component behavior

### 16.4 Don't Do This

- Don't define design rules on the fly while writing pages
- Don't hardcode colors throughout components
- Don't give each page its own animation timing
- Don't treat multi-platform adaptation as just scaling the layout
- Don't wait until late in development to add theme structure

### 16.5 Recommended Implementation Order

#### Phase 1
- theme.css
- shadcn base components
- Unify Button / Card / Input / Dialog

#### Phase 2
- Dashboard / Landing Page page templates
- motion-tokens.css
- Base reveal components

#### Phase 3
- Implement multi-platform behavior matrix
- adaptive tokens
- use-device / adaptive-dialog / adaptive-table

#### Phase 4
- Extend themes
- Extend animations
- Desktop / App platform adaptation

---

## 17. One-Line Summary

This unified Skill’s goal is not to make projects “look okay” — it’s to enable frontend engineers to build continuously on a set of **unified, extensible, maintainable, and cross-platform-ready** rules.

It unifies six things:

- Design language
- Light/dark theming
- shadcn/ui engineering standards
- Animation module
- Multi-platform adaptation
- **Full-stack project scaffold standards** (Chapter 18)

The end result should be:

**One system that supports brand websites, product backends, mobile experiences, and future App / Desktop extensions — structured, standardized, and runnable from the very first line of code.**

## 18. Project Scaffold Module

> This chapter defines the complete standard for creating a **frontend/backend-separated full-stack TypeScript project** from scratch, using `workstation-energy-center` as the baseline — structured and ready to run out of the box. Applies to all new projects built on this Skill.

---

### 18.1 Pre-Creation Checklist

Before starting, confirm the following (skip if already provided):

| Item | Default | Notes |
|------|--------|------|
| Project name | `workstation-energy-center` | Affects directory name and package.json |
| Brand color | `#EC5331` | Written to `--brand-primary` in `globals.css` |
| Database name | Same as project name | Written to `backend/.env.local` |
| Feature modules | All (status / cards / translator / comfort / config) | Determines file count in routes, controllers, pages/admin |

---

### 18.2 Standard Directory Structure

Create using the following structure — **do not omit any level**:

```
{project-name}/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.local
│   ├── .env.production
│   ├── public/images/
│   ├── styles/
│   │   ├── globals.css          ← Theme Token entry point (see Chapters 6–8)
│   │   └── tailwind.css
│   ├── lib/
│   │   ├── gsapUtils.ts         ← See Chapter 12
│   │   ├── reactBitsUtils.ts
│   │   └── apiClient.ts         ← Unified wrapper for all backend requests
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useStatus.ts
│   │   ├── useTranslator.ts
│   │   └── useComfort.ts
│   ├── components/
│   │   ├── ui/                  ← Base UI components (no business logic)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/              ← Global structural components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/            ← Business feature components
│   │       ├── StatusSign.tsx
│   │       ├── Countdown.tsx
│   │       ├── Translator.tsx
│   │       ├── ComfortBox.tsx
│   │       └── FeaturedCards.tsx
│   └── pages/
│       ├── _app.tsx             ← Contains SSR anti-FOUC script (see Section 16.1)
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
│       ├── server.ts            ← Entry point, loads .env.local
│       ├── app.ts               ← Express init, route registration, errorHandler
│       ├── routes/              ← Path definitions only, logic lives in controllers
│       │   ├── status.ts
│       │   ├── cards.ts
│       │   ├── translator.ts
│       │   ├── comfort.ts
│       │   └── config.ts
│       ├── controllers/         ← Request handling, calls services, throws errors up
│       │   ├── statusController.ts
│       │   ├── cardsController.ts
│       │   ├── translatorController.ts
│       │   ├── comfortController.ts
│       │   └── configController.ts
│       ├── services/
│       │   └── dbService.ts     ← All Prisma operations centralized here
│       ├── middleware/
│       │   └── errorHandler.ts  ← Unified error handling — no per-line try/catch in controllers
│       └── utils/
│           └── gsapUtils.ts
│   └── prisma/
│       ├── schema.prisma        ← Contains Status / Card / Translator / Comfort / Config
│       └── seed.ts
├── docker-compose.yml
└── README.md
```

---

### 18.3 Key File Conventions

**Frontend files that must contain real content:**

| File | Requirement |
|------|------|
| `frontend/styles/globals.css` | Full three-layer Token system (see Chapters 6–8) |
| `frontend/pages/_app.tsx` | Contains SSR anti-FOUC script (see Section 16.1) |
| `frontend/lib/apiClient.ts` | Wraps fetch with baseURL and unified error handling |
| `frontend/lib/gsapUtils.ts` | Contains fadeInUp / staggerReveal / createScrollReveal |
| `frontend/next.config.js` | Contains API rewrite to backend |
| `frontend/.env.local` | `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` |

**Backend files that must contain real content:**

| File | Requirement |
|------|------|
| `backend/src/server.ts` | Loads dotenv, starts Express |
| `backend/src/app.ts` | Registers all routes, mounts errorHandler (must be after routes) |
| `backend/src/middleware/errorHandler.ts` | Unified 500 handling, logs err.message |
| `backend/prisma/schema.prisma` | Contains all 5 models |
| `backend/prisma/seed.ts` | Contains seed data, runnable via `npx prisma db seed` |
| `backend/.env.local` | Contains PORT and DATABASE_URL |

---

### 18.4 Naming Conventions

| Type | Rule | Example |
|------|------|------|
| Component file | PascalCase | `StatusSign.tsx` |
| Hook file | camelCase with `use` prefix | `useStatus.ts` |
| Utility / Service | camelCase | `apiClient.ts`, `dbService.ts` |
| Route / Controller | camelCase | `statusController.ts` |
| CSS variable | kebab-case, semantic naming | `--brand-primary`, `--card-bg` |

---

### 18.5 Initialization Commands

After creating all files, execute in the following order:

```bash
# ── Option A: Local Development ──

# 1. Frontend dependencies
cd frontend && npm install

# 2. Backend dependencies
cd ../backend && npm install

# 3. Initialize database (PostgreSQL must be running)
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start in separate terminals
cd ../frontend && npm run dev      # → http://localhost:3000
cd ../backend  && npm run dev      # → http://localhost:4000

# ── Option B: Docker one-command start ──
cd {project-name} && docker-compose up --build
# → http://localhost:3000
# → http://localhost:4000
```

---

### 18.6 How the Frontend Connects to This Skill

After project creation, all development inside `frontend/` must follow the standards defined in this document:

| Skill Chapter | Location in Project |
|---------------|-------------------|
| Chapters 6–8: Theme Tokens | `frontend/styles/globals.css` |
| Chapter 10: shadcn/ui Standards | `frontend/components/ui/` |
| Chapter 12: Animation Module | `frontend/lib/gsapUtils.ts`, `frontend/components/features/` |
| Chapter 13: Multi-Platform | `frontend/lib/use-device.ts`, `frontend/components/` |
| Section 16.1: SSR Anti-FOUC | `frontend/pages/_app.tsx` |

---

### 18.7 Common Questions

**Frontend only:** Create only the `frontend/` directory, skip `backend/` and `docker-compose.yml`.

**Backend only:** Create only the `backend/` directory, skip `frontend/`.

**Changing the module list:** Update files in `routes/`, `controllers/`, and `pages/admin/` in sync with the new module names — no orphaned files.

**Changing the tech stack:** Replace dependencies in `package.json` and update related config files, but keep the directory layer structure intact.
