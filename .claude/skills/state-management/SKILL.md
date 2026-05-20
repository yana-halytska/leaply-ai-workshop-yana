---
name: state-management
description: Create or extend a zustand store for state that lives beyond a single component (cross-page, cross-component, persisted).
---

# State management with zustand

**zustand is the only state library in this project.** No Redux, no
Jotai, no Recoil, no MobX, no React Context for global state. If the
user describes a need that sounds like "remember this", "share between
pages", "persist across reloads" — it's a zustand store.

## When to use what

| Scope                                 | Tool                               |
| ------------------------------------- | ---------------------------------- |
| Single component, no children need it | `useState` / `useReducer`          |
| Parent → child, 1–2 levels            | props                              |
| Anything broader, or persisted        | **zustand store in `lib/stores/`** |
| Server data (fetch + cache)           | RSC / Next.js fetch, not zustand   |

## File location

All stores live in `lib/stores/<name>-store.ts`. One store per concern
(`auth-store.ts`, `cart-store.ts`, `ui-store.ts`).

## Minimal store template

```ts
// lib/stores/counter-store.ts
import { create } from "zustand"

type CounterState = {
  count: number
  increment: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

Use it in a component:

```tsx
"use client"
import { useCounterStore } from "@/lib/stores/counter-store"

export function Counter() {
  const count = useCounterStore((s) => s.count)
  const increment = useCounterStore((s) => s.increment)
  return <button onClick={increment}>{count}</button>
}
```

Always **select narrow slices** (`(s) => s.count`) rather than reading
the whole store — it prevents unnecessary re-renders.

## Persisting to localStorage

Use the `persist` middleware. The key under `name:` is the localStorage
key — choose something app-specific:

```ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemeState = {
  theme: "light" | "dark"
  setTheme: (t: "light" | "dark") => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "leaply-theme" }
  )
)
```

**Hydration gotcha:** persisted stores read from localStorage on the
client only. If you read the value during SSR, it'll be the initial
value and then change after hydration → React warning. Either:

- Read inside `useEffect`, or
- Use `useStore` + `skipHydration: true` and call `rehydrate()` in a
  `useEffect`.

For most apps the first option is fine.

## Cross-store communication

If store A needs to react to store B, **call `getState()`** inside the
action — don't subscribe:

```ts
import { useAuthStore } from "./auth-store"

// inside cart-store
clearOnLogout: () => {
  const { user } = useAuthStore.getState()
  if (!user) set({ items: [] })
}
```

## What you must NOT do

- ❌ Wrap the whole app in a Context to "share state". Use a store.
- ❌ Add another state library. Stop and ask the user first.
- ❌ Put server data in zustand. Server components fetch on the server;
  client mutations re-fetch via revalidation.
- ❌ Store secrets (API keys, tokens) in a persisted store —
  localStorage is readable by any script on the page.
