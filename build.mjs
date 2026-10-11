import { writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(ROOT, 'images');
const OUT = join(ROOT, 'index.html');

// ===========================================================================
// CONTENT — edit here. (Reviews are auto-discovered from images/.)
// ===========================================================================
const PROFILE = {
  name: 'Aviral Gupta',
  title: 'Software Engineer 2 · Developer Productivity & Test Infrastructure',
  links: {
    linkedin: 'https://www.linkedin.com/in/aviral-gupta-754341152/',
    github: 'https://github.com/aviralgupta752',
    email: 'guptaavi352@gmail.com',
  },
};

// Latest N quarters get the green "Standout" treatment, automatically.
const HIGHLIGHT_LATEST = 3;

// Optional per-quarter extras, keyed by image stem (e.g. "fy26-q4").
const REVIEW_META = {
  'fy26-q3': { quote: '…one of the most dependable team members, and have truly mastered the art of getting things done.' },
  'fy26-q4': { quote: "You're delivering at a very high level … your trajectory is very strong." },
  'fy27-q1': { quote: 'You have operated like a one-man army across multiple initiatives…' },
};
const DEFAULT_RATING = 'Doing Well';

// ===========================================================================
// GENERATION
// ===========================================================================
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const periodFor = (fy, q) => {
  const y = 2000 + fy - 1; // Postman FY<N> starts Feb 1 of calendar year (2000 + N − 1)
  return {
    1: `Feb 1 – Apr 30, ${y}`,
    2: `May 1 – Jul 31, ${y}`,
    3: `Aug 1 – Oct 31, ${y}`,
    4: `Nov 1, ${y} – Jan 31, ${y + 1}`,
  }[q];
};

const reviews = readdirSync(IMG_DIR)
  .map((file) => {
    const m = /^fy(\d{2})-q([1-4])\.(png|jpe?g|webp|gif)$/i.exec(file);
    if (!m) return null;
    const fy = parseInt(m[1], 10);
    const q = parseInt(m[2], 10);
    const key = `fy${m[1]}-q${m[2]}`.toLowerCase();
    const meta = REVIEW_META[key] || {};
    return {
      file, key, fy, q,
      label: `FY${fy} Q${q}`,
      period: periodFor(fy, q),
      sort: fy * 10 + q,
      rating: meta.rating || DEFAULT_RATING,
      quote: meta.quote,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.sort - b.sort);

const cutoff = reviews.length - HIGHLIGHT_LATEST;
reviews.forEach((r, i) => (r.highlight = i >= cutoff));
const ordered = [...reviews].reverse(); // newest first

const reviewsHtml = ordered.map((r) => {
  const cls = r.highlight ? ' class="is-highlight"' : '';
  const star = r.highlight ? ' <span class="star">★ Standout</span>' : '';
  const quote = r.highlight && r.quote ? `\n        <p class="rquote">“${esc(r.quote)}”</p>` : '';
  return `      <figure${cls}>
        <figcaption><span class="rlabel">${esc(r.label)}</span> <span class="rperiod">${esc(r.period)}</span> <span class="rating">${esc(r.rating)}</span>${star}</figcaption>${quote}
        <img loading="lazy" alt="${esc(r.label)} manager performance review (${esc(r.period)})" src="images/${esc(r.file)}" />
      </figure>`;
}).join('\n');

const { linkedin, github, email } = PROFILE.links;
const year = new Date().getFullYear();

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(PROFILE.name)} — Manager Feedback</title>
  <meta name="description" content="Quarterly manager performance evaluations for ${esc(PROFILE.name)}, most recent first." />
  <style>
    :root {
      --ink: #1a1d23; --muted: #5b6474; --soft: #f6f9fa; --line: #e6e9ec;
      --good: #15803d; --good-ink: #166534; --good-soft: #dcfce7; --good-line: #bbf7d0; --good-bg: #f0fdf4; --good-accent: #16a34a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; background: #fff; color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5; -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 1072px; margin: 0 auto; padding: 48px 24px 72px; }

    header.page { margin: 0 0 40px; padding-bottom: 26px; border-bottom: 1px solid var(--line); }
    header.page h1 { font-size: 27px; font-weight: 800; letter-spacing: -.02em; margin: 0; }
    header.page .role { margin: 7px 0 0; font-size: 15px; color: var(--muted); }
    header.page .facts { margin: 14px 0 0; font-size: 12.5px; color: #9ca3af; }

    .reviews { display: grid; gap: 38px; }
    figure { margin: 0; }
    figcaption { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 14px; margin: 0 0 10px; }
    .rlabel { font-weight: 600; }
    .rperiod { color: var(--muted); }
    .rating { font-size: 11.5px; font-weight: 700; color: var(--muted); background: var(--soft); border: 1px solid var(--line); border-radius: 999px; padding: 2px 9px; }
    .star { font-size: 11px; font-weight: 700; color: var(--good); background: var(--good-soft); border-radius: 999px; padding: 2px 9px; }
    .rquote { margin: 0 0 12px; font-style: italic; color: var(--good-ink); font-size: 15px; max-width: 80ch; }
    figure img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 10px; }
    figure.is-highlight { background: var(--good-bg); border: 1px solid var(--good-line); border-left: 3px solid var(--good-accent); border-radius: 12px; padding: 18px 18px 20px; }

    footer { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--line); color: var(--muted); font-size: 13px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    footer a { color: var(--muted); text-decoration: none; }
    footer a:hover { color: var(--good); }

    @media (max-width: 560px) { .wrap { padding: 28px 14px 56px; } }
    @media print {
      figure, header.page { break-inside: avoid; }
      figure.is-highlight { background: #fff; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="page">
      <h1>${esc(PROFILE.name)}</h1>
      <p class="role">${esc(PROFILE.title)}</p>
      <p class="facts">Quarterly manager feedback · most recent first · Rated “${esc(DEFAULT_RATING)}” across all cycles · ★ marks standout quarters</p>
    </header>

    <main class="reviews">
${reviewsHtml}
    </main>

    <footer>
      <span>© ${year} ${esc(PROFILE.name)}</span>
      <span><a href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${github}" target="_blank" rel="noopener">GitHub</a> · <a href="mailto:${email}">Email</a></span>
    </footer>
  </div>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log('wrote', OUT, Buffer.byteLength(html), 'bytes ·', reviews.length, 'reviews (', reviews.filter((r) => r.highlight).length, 'highlighted )');
