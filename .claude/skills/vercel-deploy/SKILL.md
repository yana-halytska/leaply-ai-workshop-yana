---
name: vercel-deploy
description: Help a non-technical user deploy their app to Vercel's free Hobby tier for the first time, or troubleshoot a redeploy. Walk through the Vercel dashboard step by step.
---

# Deploying to Vercel (Hobby / free tier)

The user said _"put it online"_, _"make it a real website"_, _"deploy
it"_. They want a live URL.

**Division of labor (Rule 0 applies):** you run `npm run build` and any
`git` commands yourself. The user only does the parts that require
their Vercel/GitHub login in a browser — signing in, importing the
repo, pasting env vars into the dashboard, clicking **Deploy**. Don't
ask them to type a terminal command at any point in this flow.

## The model

Vercel watches a GitHub repository. Every time you `git push`, Vercel
builds and redeploys automatically. So **deployment = connecting Vercel
to GitHub once, then pushing**.

This means before deploying, the code **must already be on GitHub** —
see `.claude/skills/github-publish/SKILL.md`. If it isn't, start there
and come back.

## Pre-flight checks

Before sending the user to Vercel, make sure the build works locally:

```bash
npm run build
```

If this fails locally, it will fail on Vercel — fix the errors first.
Common issues:

- Missing env var referenced as `process.env.X` (see
  `.claude/skills/env-variables/SKILL.md`)
- A client component using a Node API
- A type error or lint error you skipped

## First-time deploy — the script

Read this to the user, literally:

> 1.  Open <https://vercel.com/new> in your browser.
> 2.  If you're not signed in: click **Continue with GitHub** and sign
>     in with the same GitHub account where you pushed your project.
> 3.  You'll see a list of your GitHub repositories. Find the one you
>     just pushed (e.g. `my-leaply-app`) and click **Import**.
>     - If you don't see it, click **Adjust GitHub App Permissions**
>       and give Vercel access to that repo.
> 4.  On the configure screen:
>     - **Project Name**: leave as is or shorten it.
>     - **Framework Preset**: should auto-detect as **Next.js**. If it
>       doesn't, select **Next.js** manually.
>     - **Root Directory**: leave as is.
>     - **Build & Output Settings**: leave as is.
>     - **Environment Variables**: skip for now (we'll add them later
>       if needed).
> 5.  Click **Deploy**.
> 6.  Wait ~1–3 minutes. When it's done, Vercel shows a confetti
>     animation and a link like
>     `https://my-leaply-app-xyz.vercel.app`. Click it to see your live
>     site.

Tell the user that **every future `git push` to `main` will redeploy
automatically.**

## Subsequent deploys

After the first deploy, the user does nothing on Vercel. The flow is:

1. User asks Claude to make changes.
2. Claude makes them.
3. User says _"publish this"_ / _"update the site"_.
4. Claude saves a snapshot (`git-commit` skill) and pushes (`git push`).
5. Vercel auto-rebuilds in ~1–2 minutes. The live site updates.

If the user wants to peek at the deployment status, point them to
<https://vercel.com/dashboard> → their project → latest deployment.
They don't need to go there for a successful deploy — Vercel emails on
failure.

## When a deployment fails

Vercel will email the user and show a red "Failed" status on the
dashboard.

The user is the only one who can see the Vercel build log — Claude
can't. So:

1. **Ask the user, in plain words:** _"Open your project on
   <https://vercel.com/dashboard>, click the failed deployment at the
   top, then click 'View Build Logs'. Copy the last 30–50 lines and
   paste them here."_
2. From the pasted log, **you** diagnose the issue. It's almost always
   one of:
   - **Missing env var** → run the env-variables skill.
   - **Type error skipped locally** → you reproduce with
     `npm run build`, fix, commit, push.
   - **ESLint error** → you run `npm run lint`, fix, commit, push.
   - **`npm install` failure** → an incompatible dependency. You inspect
     `package.json` and downgrade or replace.
3. **You** fix the code, save the snapshot, and push. Vercel retries
   automatically on the new push — the user doesn't have to do
   anything on Vercel.

## Environment variables on Vercel

If the app uses any `process.env.X` (especially secrets — API keys,
database URLs), the user must add them in the Vercel dashboard before
the deploy will work in production. See
`.claude/skills/env-variables/SKILL.md`.

## Custom domain (later, optional)

Vercel gives a free `*.vercel.app` subdomain. If the user owns a custom
domain:

> Open your project on Vercel → **Settings** → **Domains** → enter your
> domain → follow the DNS instructions Vercel shows.

Don't push this on the user — only walk through it if they ask.

## Hobby tier limits to be aware of

The free Hobby plan is generous but has limits the user should know
about if their project grows:

- **Personal, non-commercial use only.** If the project starts making
  money or represents a business, they need to upgrade.
- **100 GB bandwidth/month**, **6,000 build minutes/month**.
- **No team members** (only the owner can deploy).
- **Serverless function timeout: 10 seconds.**

Mention these only if the user asks "is this really free?" or hits a
limit.

## What you must NOT do

- ❌ Use the Vercel CLI (`vercel`) for the first-time setup. The
  dashboard is more learnable for a non-technical user.
- ❌ Configure custom build commands or output directories — the
  Next.js preset just works.
- ❌ Suggest paid features when the user hasn't asked.
