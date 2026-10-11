# Repo guide for AI agents

Manager-feedback page for Aviral Gupta (linked from his résumé). `index.html` is
**generated** — don't hand-edit it.

## ⚠️ Pushing: switch GitHub account first

This repo is owned by **`aviralgupta752`**. On the primary dev machine the default
`gh`/git account is **`aviralpostman`**, which has only **READ** here. Switch before
pushing and switch back after:

```bash
gh auth switch -u aviralgupta752     # BEFORE git commit / push
#   git add -A && git commit -m "…" && git push
gh auth switch -u aviralpostman      # restore the default when done
```

If `aviralgupta752` isn't logged in on this machine yet:

```bash
gh auth login --hostname github.com --git-protocol https --web --scopes "repo,workflow"
```

(The `workflow` scope is required — pushes that touch `.github/workflows/` are
rejected over HTTPS without it.)

## Building

`index.html` is produced by `build.mjs` from:
- a little profile data + optional per-quarter quotes at the top of `build.mjs`, and
- the review screenshots in `images/`, which are **auto-discovered**.

The GitHub Action runs `node build.mjs` on every push, so the live site always
matches the repo. Locally: `node build.mjs` then open `index.html`.

## Adding a new quarter's manager feedback

1. Add the screenshot to `images/` named `fy<FY>-q<Q>.png` — e.g. `fy27-q2.png`.
   **No number prefix.** `jpg`/`webp` also work.
2. (Optional) add a pulled quote in `REVIEW_META` in `build.mjs`, keyed by the
   file stem (e.g. `'fy27-q2'`).
3. Commit & push (with the account switch above).

The generator computes the quarter's date range from `fy<FY>-q<Q>`, sorts the
newest quarter to the top, and highlights the latest `HIGHLIGHT_LATEST` (default 3)
automatically — no other edits needed.

## Editing content

The profile fields and the optional per-quarter pull-quotes (`REVIEW_META`) live
as data at the top of `build.mjs`. Edit there, run `node build.mjs`, commit, push.
