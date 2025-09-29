## Motion and animation strategy for this repo (Next.js 15, React 19, Tailwind 4)

### TL;DR
- **CSS-first for micro-interactions**: Use Tailwind transitions (`transition`, `duration-200`, `ease-out`) and built-in `animate-*` utilities for hover/focus states and simple loops.
- **Framer Motion for real choreography**: Use for enter/exit animations, shared/layout transitions, route transitions, scroll reveals, and gestures.
- **Respect accessibility**: Honor `prefers-reduced-motion`; avoid parallax/large motion for users who opt out.
- **Performance**: Animate `opacity`/`transform` only; avoid layout-affecting properties; keep durations 150–300ms (micro), 300–500ms (page/overlay).
- **Bundle hygiene**: Wrap with `LazyMotion` and keep motion in client components only; code-split motion-heavy sections.

---

### Recommended stack
- **Tailwind CSS 4**: Already present. Ideal for simple transitions and built-in `animate-` utilities.
- **Framer Motion**: Best-in-class for complex UI animation and orchestration in React 19 + App Router.
  - Install: `npm i framer-motion`
- Optional, lighter: **Motion One** (`motion` package) if you only need occasional keyframe-based effects.

> Note: `tw-animate-css` is present. Tailwind v4 has strong built-in animation utilities; use the plugin only if you specifically want its prebuilt keyframes.

---

### Setup with Framer Motion (Next.js App Router)

Create a small provider to enable tree-shakable features and keep bundle size lean.

```tsx
// app/motion-provider.tsx
"use client";
import { LazyMotion, domAnimation } from "framer-motion";
import React from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
```

Wrap your layout (client boundary around where you use motion):

```tsx
// app/layout.tsx (snippet)
import React from "react";
import { MotionProvider } from "./motion-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```

> Any component using Framer Motion must be a client component (`"use client"`).

---

### Route transitions (page enter/exit)

```tsx
// app/route-transition.tsx
"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion"; // m = alias for motion

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
```

Use it where you render `children` for routes (e.g., in `app/(site)/layout.tsx`).

---

### Component examples

- **CSS micro-interaction (Tailwind)**

```tsx
<button className="transition-transform duration-200 ease-out active:scale-95 hover:scale-[1.02]">
  Click me
</button>
```

- **Enter on mount (Framer Motion)**

```tsx
"use client";
import { m } from "framer-motion";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </m.div>
  );
}
```

- **Scroll reveal (viewport-aware)**

```tsx
"use client";
import { m } from "framer-motion";

export function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
```

- **Radix UI + CSS states**
  Radix primitives expose `data-state="open|closed"`. Animate with CSS for lightweight effects.

```css
/* globals.css */
@keyframes dialogIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
@keyframes dialogOut { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(8px) scale(.98) } }

[data-radix-popper-content-wrapper] [data-state="open"] { animation: dialogIn 220ms ease-out; }
[data-radix-popper-content-wrapper] [data-state="closed"] { animation: dialogOut 160ms ease-in; }
```

---

### Accessibility and reduced motion

- Use Framer Motion’s `useReducedMotion()` to conditionally skip/shorten animations.
- Keep color-contrast strong; don’t use animation as the only signifier of state.
- Avoid large, continuous parallax or autoscroll for users who prefer reduced motion.

```tsx
"use client";
import { m, useReducedMotion } from "framer-motion";

export function SafeFade({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReduced ? 0.001 : 0.2 }}
    >
      {children}
    </m.div>
  );
}
```

---

### Performance tips
- Prefer `transform`/`opacity`; avoid animating `width/height/top/left`.
- Use `will-change: transform` only on elements actively animating.
- Keep reflow triggers inside motion components minimal; don’t animate huge DOM subtrees at once.
- Test on low-end devices; cap frame budget to 16ms for 60fps.

---

### When to choose what
- **Tailwind transitions**: Buttons, links, icons, hover/active/pressed states.
- **CSS keyframes**: Spinners, looping affordances, subtle background movement.
- **Framer Motion**: Page transitions, modals/drawers, complex lists (reorder/drag), staged entrances, shared element transitions.

This approach keeps simple things simple, while giving you power and ergonomics for complex, high-quality motion without bloating the bundle or harming accessibility.
