---
name: shadcn-component
description: Add a UI component (button, dialog, input, form, table, etc.) by installing it from shadcn/ui via the CLI. Never hand-write a primitive that exists in shadcn.
---

# Adding shadcn/ui components

The user wants a UI element (button, modal, form field, dropdown, sheet,
tooltip, table, etc.). Resist the urge to write it yourself — shadcn
already has it, and the CLI keeps it consistent with the rest of the app.

## Workflow

### 1. Check what's already installed

Look in `components/ui/`. If a file matching the component name exists,
**use it** — do not reinstall (that overwrites local edits).

```ts
import { Button } from "@/components/ui/button"
```

### 2. Confirm the component exists in shadcn

Browse <https://ui.shadcn.com/docs/components> mentally. Common ones:

`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`,
`button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`,
`collapsible`, `command`, `context-menu`, `dialog`, `drawer`,
`dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`,
`menubar`, `navigation-menu`, `pagination`, `popover`, `progress`,
`radio-group`, `resizable`, `scroll-area`, `select`, `separator`,
`sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`,
`tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

If you're unsure whether shadcn ships the thing, ask the user to confirm
the visual, then check the registry rather than guessing.

### 3. Install via the CLI

Always use `@latest` so the install matches the current shadcn config.
Multiple components can be added in one call:

```bash
npx shadcn@latest add button dialog input
```

The CLI reads `components.json` and drops files into `components/ui/`.

### 4. Wire it up

Import via the `@/components/ui/<name>` alias. Compose, don't fork —
build your feature component **on top of** the primitive in a sibling
file under `components/`, not by editing the shadcn file.

```tsx
// components/save-dialog.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SaveDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save your work</DialogTitle>
        </DialogHeader>
        {/* ... */}
      </DialogContent>
    </Dialog>
  )
}
```

## What you must NOT do

- ❌ Paste a hand-written `Button.tsx` based on memory.
- ❌ Edit files in `components/ui/` to "tweak" the primitive. Wrap it in
  a new component in `components/` instead.
- ❌ Mix in another UI library (MUI, Chakra, Mantine, HeadlessUI).
- ❌ Install without `@latest` — version drift breaks the registry.

## Forms

For any form, install both `form` and `input` (plus `label`, `select`,
etc. as needed). Forms are built with `react-hook-form` + `zod` — see
`.claude/skills/validation/SKILL.md`.

```bash
npx shadcn@latest add form input label
```

## Toasts

Use `sonner` (the modern shadcn default). Add the `<Toaster />` to
`app/layout.tsx` once, then call `toast()` anywhere.

```bash
npx shadcn@latest add sonner
```

## After installing

Run `npm run build` once to confirm the new files compile.
