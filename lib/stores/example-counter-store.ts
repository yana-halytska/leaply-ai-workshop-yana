// Example zustand store. Safe to delete once you create your own.
// See .claude/skills/state-management/SKILL.md for the pattern.

import { create } from "zustand"
import { persist } from "zustand/middleware"

type CounterState = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useExampleCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
      decrement: () => set((s) => ({ count: s.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    { name: "leaply-example-counter" }
  )
)
