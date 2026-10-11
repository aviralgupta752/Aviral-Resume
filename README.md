# Aviral Gupta — Performance Reviews

A single, static page showing my quarterly manager performance evaluations in
chronological order (FY25 Q3 → FY27 Q1).

**Live site:** https://aviralgupta752.github.io/Aviral-Resume/ *(available after the first deploy)*

## Updating the screenshots (e.g. HD versions)

Each review is a plain image file in [`images/`](images/), referenced by
`index.html`. To swap in a higher-resolution screenshot, **replace the file
keeping the same name**, then commit and push to `main` — the site redeploys
automatically.

| Order | File | Review period |
|------:|------|---------------|
| 1 | `images/1-fy25-q3.png` | FY25 Q3 · Aug 1 – Oct 31, 2024 |
| 2 | `images/2-fy25-q4.png` | FY25 Q4 · Nov 1, 2024 – Jan 31, 2025 |
| 3 | `images/3-fy26-q1.png` | FY26 Q1 · Feb 1 – Apr 30, 2025 |
| 4 | `images/4-fy26-q2.png` | FY26 Q2 · May 1 – Jul 31, 2025 |
| 5 | `images/5-fy26-q3.png` | FY26 Q3 · Aug 1 – Oct 31, 2025 |
| 6 | `images/6-fy26-q4.png` | FY26 Q4 · Nov 1, 2025 – Jan 31, 2026 |
| 7 | `images/7-fy27-q1.png` | FY27 Q1 · Feb 1 – Apr 30, 2026 |

New quarter? Add `images/8-….png`, then add a matching `<figure>` block in
`index.html`.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes the
repository to GitHub Pages on every push to `main` (and on manual
*Run workflow*). It's a static site — no build step.
