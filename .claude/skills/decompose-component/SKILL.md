---
name: decompose-component
description: Split a React component file when it exceeds ~200 lines. Extract sub-components, custom hooks, and pure helpers into sibling files.
---

# Decomposing oversized components

## When to trigger

Any `.tsx` file in `app/` or `components/` (excluding `components/ui/`,
which is auto-generated) that has crossed **~200 lines**. Check the line
count whenever you're about to edit such a file, or whenever you've just
finished adding to one.

```bash
wc -l components/*.tsx app/**/*.tsx 2>/dev/null | sort -n | tail
```

If the largest is > 200, decompose before doing anything else.

## How to split

Look for these patterns and extract each into its own file:

### 1. Sub-components — extract into siblings

A nested `function Row()` or a large JSX block that's logically one unit
becomes its own file:

```
components/
  user-list.tsx           ← parent (now smaller)
  user-list-row.tsx       ← extracted
  user-list-empty.tsx     ← extracted
```

Rule: one component per file, named after the file. Default export only
when the file is a Next.js page; otherwise named exports.

### 2. Stateful logic — extract into a custom hook

If the component has 3+ `useState`/`useEffect`/`useMemo` calls that
belong together, lift them into `hooks/use-<thing>.ts`:

```ts
// hooks/use-debounced-search.ts
export function useDebouncedSearch(initial = "") {
  const [query, setQuery] = useState(initial)
  const [debounced, setDebounced] = useState(initial)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(id)
  }, [query])
  return { query, setQuery, debounced }
}
```

### 3. Pure helpers — extract into `lib/`

Date formatting, string manipulation, derived calculations — anything
that doesn't touch React — goes in `lib/<topic>.ts`.

### 4. Cross-component state — lift to a zustand store

If sibling components need to read/write the same data, that's a store,
not prop drilling. See `.claude/skills/state-management/SKILL.md`.

## Naming convention

- Files: `kebab-case.tsx` (matches existing repo style)
- Components: `PascalCase`
- Hooks: `useThing` in `use-thing.ts`
- The exported name and the filename must match (modulo case).

## What stays in the parent

After splitting, the parent component should be a thin orchestrator:
layout, composition, and connecting the pieces. If the parent is still
over 200 lines, decompose again — there's usually one more boundary
you missed.

## Validation after splitting

```bash
npm run typecheck && npm run lint && npm run build
```

All three must pass. The build catches issues like missing
`"use client"` directives on extracted client components.

### Client vs. server components

When extracting from a client component, the new file inherits the same
`"use client"` requirement if it uses state, effects, or browser APIs.
Add `"use client"` at the top of the new file if needed. Server
components stay server unless they reach into client-only territory.

## Do not

- ❌ Split for splitting's sake. Three tightly coupled 80-line components
  in one file is fine — splitting them just to hit a number creates
  navigation overhead.
- ❌ Extract a one-off 5-line helper into `lib/`. Inline is better.
- ❌ Create deeply nested directories. One level under `components/` is
  enough for almost all cases.
