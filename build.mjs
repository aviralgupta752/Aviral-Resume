import { writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(ROOT, 'images');
const OUT = join(ROOT, 'index.html');

// ===========================================================================
// CONTENT — edit here. (Manager reviews are auto-discovered from images/.)
// ===========================================================================
const PROFILE = {
  name: 'Aviral Gupta',
  title: 'Software Engineer 2 · Developer Productivity & Test Infrastructure',
  location: 'India',
  blurb:
    'I build the platforms, CI/CD, and AI tooling that let hundreds of engineers ship a large Electron desktop app safely and fast — turning slow, flaky, manual quality processes into deterministic, self-serve, metrics-driven systems.',
  links: {
    linkedin: 'https://www.linkedin.com/in/aviral-gupta-754341152/',
    github: 'https://github.com/aviralgupta752',
    email: 'guptaavi352@gmail.com',
  },
};

const STATS = [
  { num: '67%', label: 'faster app CI (60 → 20 min)' },
  { num: '~98%', label: 'faster test authoring' },
  { num: 'Daily', label: 'releases (from weekly)' },
  { num: '37', label: 'teams on coverage guardrails' },
];

const PROJECTS = [
  {
    title: 'AI-driven test triage & debugging bots',
    body: 'An MCP server and daily LLM agents that auto-classify product bugs vs flaky failures, auto-fix test bugs, and pinpoint the culprit PR with AI-generated log summaries — removing most of the manual triage that used to stall PRs and releases.',
    tags: ['MCP', 'LLM agents', 'New Relic'],
  },
  {
    title: 'E2E coverage signals',
    body: 'A dashboard overlaying live customer-pain signals (GitHub, escalations, incident.io, Slack) on a feature-to-spec map, ranking the riskiest under-tested areas via an auditable risk formula — a deterministic Node pipeline fed by a daily AI agent, shipped as a React/Vite app.',
    tags: ['React/Vite', 'AI agent', 'Looker'],
  },
  {
    title: 'AI-assisted authoring & Playwright CI',
    body: 'The Playwright platform that powered the migration off WebdriverIO — PR and hourly pipelines, flakiness gating, rich reports with video + HAR, an AI codegen workflow, and reusable page objects.',
    tags: ['Playwright', 'CircleCI', 'AI codegen'],
    metrics: ['67% faster CI', '~98% faster authoring'],
  },
  {
    title: 'Selective (change-based) test execution',
    body: 'Coverage-derived selection turns per-spec V8 coverage into a source-to-spec map so a PR runs only the specs it affects, auto-scaling parallelism and falling back to the full suite only for large changes.',
    tags: ['V8 coverage', 'CI cost'],
    metrics: ['~30% cheaper unit CI'],
  },
  {
    title: 'Test-coverage guardrails (patch coverage)',
    body: 'Blocking incremental-coverage checks on new code, scored against CODEOWNERS, with backend floors (70% critical / 50% non-critical). Onboarded IAM, Workspaces, Collections, PAN and Billing.',
    tags: ['NYC/Istanbul', 'SonarQube'],
    metrics: ['37 teams enforced'],
  },
  {
    title: 'App & release performance guardrails',
    body: 'Launch/relaunch benchmarking (Playwright → CircleCI → New Relic) and release P90/P95 gates across Linux, macOS (Apple Silicon) and Windows that fail a release on a >15% / >250 ms regression — plus a critical-path bundle-size budget.',
    tags: ['Web Perf API', 'P90/P95', 'multi-OS'],
  },
  {
    title: 'Release confidence & faster releases',
    body: 'A release-confidence metric that blocks tier rollouts below 95%, plus automated daily-release analysis that replaced most of the manual signoff (~4–5 hrs/build) — enabling daily, sub-60-minute releases.',
    tags: ['Release automation'],
    metrics: ['Daily releases'],
  },
  {
    title: 'E2E reliability & flakiness reduction',
    body: 'Cut flakiness with framework auto-waiting, service virtualization (record/replay) for Postman services, and more actionable Slack alerts and flakiness-trend dashboards.',
    tags: ['Service virtualization', 'Slack alerts'],
  },
  {
    title: 'Windows CI IP-allowlisting pipeline',
    body: 'An AWS Lambda + SQS pipeline that registers each runner’s dynamic IP in the Cloudflare allowlist and flushes it afterwards — removing a race condition that intermittently failed Windows E2E runs.',
    tags: ['AWS Lambda', 'SQS', 'Cloudflare'],
  },
  {
    title: 'On-call, incident.io migration & scale',
    body: 'Migrated on-call alerting from Opsgenie to incident.io (schedules, routing, a reusable helper package) and authored the runbooks; scaled the E2E platform across Windows/macOS/Linux + Apple Silicon and the EU region.',
    tags: ['incident.io', 'on-call'],
  },
];

const SKILLS = [
  { label: 'Test automation', val: 'Playwright, WebdriverIO, Puppeteer, Allure, Jest, Vitest, React Testing Library, NYC/Istanbul, page objects, service virtualization' },
  { label: 'CI/CD & build', val: 'CircleCI, GitHub Actions, Nx monorepo, Yarn v4, Docker, SWC, selective/affected execution, Bash' },
  { label: 'AI & agentic tooling', val: 'MCP servers, LLM agents, RAG, Cursor Automation, Claude, AI-assisted codegen' },
  { label: 'Observability & data', val: 'New Relic (NRQL), Looker, AWS (Lambda, SQS, Redshift, S3), SonarQube, incident.io' },
  { label: 'Performance', val: 'launch/relaunch benchmarking, Web Performance API, Lighthouse INP, bundle-size budgets, P90/P95 gating' },
  { label: 'Languages', val: 'TypeScript, JavaScript, Node.js, Python, C++' },
  { label: 'Platforms', val: 'Electron + web, multi-OS (Windows / macOS / Linux, Apple Silicon), LaunchDarkly, Cloudflare, mitmproxy' },
];

const EXPERIENCE = [
  { org: 'Postman', role: 'Software Engineer 2', dates: 'Jan 2023 – Present', sub: 'Test Infrastructure & Developer Productivity · India' },
  { org: 'AccioJob', role: 'Data Structures & Algorithms Mentor', dates: 'Apr 2022 – Dec 2023', sub: 'Mentored students on DSA problem-solving and optimal approaches' },
  { org: 'IIIT Allahabad', role: 'B.Tech, Information Technology', dates: 'Jul 2019 – Jul 2023', sub: 'CGPA 8.53' },
];

// Hobbies / personal. The first is real; the rest are PLACEHOLDERS — replace.
const INTERESTS = [
  { icon: '💻', label: 'Competitive programming', note: 'LeetCode max 2109 · CodeChef 5★ (max 2015)' },
  { icon: '♟️', label: 'Chess' },
  { icon: '📚', label: 'Reading' },
  { icon: '✈️', label: 'Travel' },
];

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

const statsHtml = STATS.map(
  (s) => `      <div class="stat"><span class="stat-num">${esc(s.num)}</span><span class="stat-label">${esc(s.label)}</span></div>`
).join('\n');

const projectsHtml = PROJECTS.map((p) => {
  const metrics = (p.metrics || []).map((x) => `<span class="metric">${esc(x)}</span>`).join('');
  const tags = (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  return `      <article class="card">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        ${metrics ? `<div class="metrics">${metrics}</div>` : ''}
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </article>`;
}).join('\n');

const skillsHtml = SKILLS.map(
  (s) => `      <div class="skill"><span class="skill-label">${esc(s.label)}</span><span class="skill-val">${esc(s.val)}</span></div>`
).join('\n');

const expHtml = EXPERIENCE.map(
  (e) => `      <div class="exp">
        <div class="exp-head"><span class="exp-role"><strong>${esc(e.org)}</strong> — ${esc(e.role)}</span><span class="exp-dates">${esc(e.dates)}</span></div>
        <div class="exp-sub">${esc(e.sub)}</div>
      </div>`
).join('\n');

const interestsHtml = INTERESTS.map(
  (i) => `      <div class="interest"><span class="interest-icon">${i.icon}</span><div><div class="interest-label">${esc(i.label)}</div>${i.note ? `<div class="interest-note">${esc(i.note)}</div>` : ''}</div></div>`
).join('\n');

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
  <title>${esc(PROFILE.name)} — ${esc(PROFILE.title)}</title>
  <meta name="description" content="${esc(PROFILE.name)} — ${esc(PROFILE.title)}. Projects, quarterly manager feedback, and skills." />
  <style>
    :root {
      --ink: #1a1d23; --muted: #5b6474; --soft: #f6f9fa; --line: #e6e9ec;
      --accent: #0e7490; --accent-dark: #0b5a70;
      --good: #15803d; --good-ink: #166534; --good-soft: #dcfce7; --good-line: #bbf7d0; --good-bg: #f0fdf4; --good-accent: #16a34a;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; background: #fff; color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5; -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); }
    .wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

    nav.nav { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,.82); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
    .nav-inner { max-width: 1080px; margin: 0 auto; padding: 13px 24px; display: flex; align-items: center; justify-content: space-between; }
    .brand { font-weight: 800; letter-spacing: -.01em; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 500; margin-left: 22px; }
    .nav-links a:hover { color: var(--accent); }

    .hero { padding: 66px 0 30px; }
    .hero h1 { font-size: 40px; font-weight: 800; letter-spacing: -.025em; margin: 0; }
    .hero .role { margin: 10px 0 0; color: var(--accent); font-weight: 600; font-size: 16px; }
    .hero .meta { margin: 6px 0 0; color: var(--muted); font-size: 14px; }
    .hero .blurb { margin: 18px 0 0; max-width: 70ch; font-size: 16px; color: #2f3640; line-height: 1.6; }
    .cta { margin: 24px 0 0; display: flex; gap: 10px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; font-size: 14px; font-weight: 600; text-decoration: none; padding: 9px 16px; border-radius: 10px; border: 1px solid var(--line); color: var(--ink); background: #fff; transition: all .15s; }
    .btn:hover { border-color: var(--accent); color: var(--accent); }
    .btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
    .btn.primary:hover { background: var(--accent-dark); }

    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 10px; }
    .stat { background: var(--soft); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
    .stat-num { display: block; font-size: 24px; font-weight: 800; color: var(--accent); letter-spacing: -.02em; }
    .stat-label { font-size: 12.5px; color: var(--muted); }

    section.block { padding: 46px 0; border-top: 1px solid var(--line); margin-top: 40px; }
    section.block:first-of-type { border-top: 0; margin-top: 0; }
    .block h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .12em; color: var(--accent); margin: 0 0 20px; font-weight: 700; }
    .section-intro { color: var(--muted); font-size: 14px; margin: -8px 0 26px; max-width: 72ch; }

    .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .card { border: 1px solid var(--line); border-radius: 14px; padding: 20px; background: #fff; transition: box-shadow .2s, transform .2s; }
    .card:hover { box-shadow: 0 10px 30px rgba(16,24,40,.08); transform: translateY(-2px); }
    .card h3 { margin: 0 0 8px; font-size: 16px; letter-spacing: -.01em; }
    .card p { margin: 0; color: #434b56; font-size: 14px; line-height: 1.55; }
    .metrics { margin: 12px 0 0; display: flex; gap: 6px; flex-wrap: wrap; }
    .metric { font-size: 12px; font-weight: 700; color: var(--good); background: var(--good-soft); border-radius: 999px; padding: 3px 10px; }
    .tags { margin: 10px 0 0; display: flex; gap: 6px; flex-wrap: wrap; }
    .tag { font-size: 11.5px; color: var(--muted); background: var(--soft); border: 1px solid var(--line); border-radius: 999px; padding: 2px 9px; }

    .skills { display: grid; gap: 10px; }
    .skill { display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: baseline; }
    .skill-label { font-weight: 700; font-size: 13.5px; }
    .skill-val { color: #434b56; font-size: 14px; }

    .exp { padding: 14px 0; border-bottom: 1px solid var(--line); }
    .exp:last-child { border-bottom: 0; }
    .exp-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap; }
    .exp-role { font-size: 15px; }
    .exp-dates { color: var(--muted); font-size: 13px; white-space: nowrap; }
    .exp-sub { color: var(--muted); font-size: 13.5px; margin-top: 3px; }

    .interests { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .interest { display: flex; gap: 13px; align-items: center; border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: #fff; }
    .interest-icon { font-size: 22px; line-height: 1; }
    .interest-label { font-weight: 600; font-size: 14.5px; }
    .interest-note { color: var(--muted); font-size: 12.5px; margin-top: 2px; }

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

    footer { border-top: 1px solid var(--line); margin-top: 20px; }
    .foot-inner { max-width: 1080px; margin: 0 auto; padding: 28px 24px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--muted); font-size: 13px; }
    .foot-inner a { color: var(--muted); text-decoration: none; }
    .foot-inner a:hover { color: var(--accent); }

    @media (max-width: 760px) {
      .cards, .interests { grid-template-columns: 1fr; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .skill { grid-template-columns: 1fr; gap: 2px; }
      .nav-links { display: none; }
      .hero { padding: 40px 0 24px; }
      .hero h1 { font-size: 30px; }
    }
    @media print {
      nav.nav { display: none; }
      .card:hover { box-shadow: none; transform: none; }
      section.block, figure, .card { break-inside: avoid; }
      figure.is-highlight { background: #fff; }
    }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <span class="brand">${esc(PROFILE.name)}</span>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#feedback">Feedback</a>
        <a href="#skills">Skills</a>
        <a href="#beyond">Beyond</a>
      </div>
    </div>
  </nav>

  <div class="wrap">
    <header class="hero" id="about">
      <h1>${esc(PROFILE.name)}</h1>
      <p class="role">${esc(PROFILE.title)}</p>
      <p class="meta">📍 ${esc(PROFILE.location)}</p>
      <p class="blurb">${esc(PROFILE.blurb)}</p>
      <div class="cta">
        <a class="btn primary" href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn" href="${github}" target="_blank" rel="noopener">GitHub</a>
        <a class="btn" href="mailto:${email}">Email</a>
      </div>
      <div class="stats">
${statsHtml}
      </div>
    </header>

    <section class="block" id="projects">
      <h2>Projects &amp; Impact</h2>
      <div class="cards">
${projectsHtml}
      </div>
    </section>

    <section class="block" id="feedback">
      <h2>Manager Feedback · by quarter</h2>
      <p class="section-intro">Quarterly manager evaluations, most recent first. Rated “${esc(DEFAULT_RATING)}” across all cycles; ★ marks standout quarters.</p>
      <div class="reviews">
${reviewsHtml}
      </div>
    </section>

    <section class="block" id="skills">
      <h2>Skills</h2>
      <div class="skills">
${skillsHtml}
      </div>
    </section>

    <section class="block" id="experience">
      <h2>Experience &amp; Education</h2>
      <div class="exp-list">
${expHtml}
      </div>
    </section>

    <section class="block" id="beyond">
      <h2>Beyond Work</h2>
      <div class="interests">
${interestsHtml}
      </div>
    </section>
  </div>

  <footer>
    <div class="foot-inner">
      <span>© ${year} ${esc(PROFILE.name)}</span>
      <span><a href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${github}" target="_blank" rel="noopener">GitHub</a> · <a href="mailto:${email}">Email</a></span>
    </div>
  </footer>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log('wrote', OUT, Buffer.byteLength(html), 'bytes ·', reviews.length, 'reviews (', reviews.filter((r) => r.highlight).length, 'highlighted )');
