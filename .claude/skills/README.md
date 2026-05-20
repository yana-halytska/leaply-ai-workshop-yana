# .claude/skills

Task-specific instructions Claude opens when the user describes a
matching intent. Each subfolder contains a `SKILL.md`.

| Skill                 | When the user wants to…                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `first-run`           | (no explicit ask — fire on the first turn of a fresh fork to install Node + deps and verify the build) |
| `shadcn-component`    | add any UI element (button, modal, form, table…)                                                       |
| `charts`              | build a chart, graph, or dashboard visualization                                                       |
| `decompose-component` | split a component file that grew over ~200 lines                                                       |
| `state-management`    | share/remember state across components or pages                                                        |
| `validation`          | validate forms, fetch responses, env vars, URL params                                                  |
| `git-commit`          | "save my work", "keep this version"                                                                    |
| `github-publish`      | "put my code on GitHub", first push or updates                                                         |
| `vercel-deploy`       | "put it online", "make it a live website"                                                              |
| `env-variables`       | add an API key, secret, or configuration value                                                         |

The user will not name these skills. Recognize the intent from plain
language and open the right one.
