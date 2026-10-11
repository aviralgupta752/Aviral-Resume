import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
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
    email: 'guptaavi352@gmail.com',
  },
};

// Hand-picked standout quarters — these get a ★ in the left nav.
// To change: add/remove an image stem like 'fy26-q2' (order doesn't matter).
const HIGHLIGHT = ['fy25-q3', 'fy26-q3', 'fy26-q4', 'fy27-q1'];

// Optional per-quarter rating overrides, keyed by image stem (e.g. "fy27-q1").
const REVIEW_META = {};
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

// Read intrinsic PNG dimensions (IHDR) so <img> can reserve space (less layout shift).
const pngSize = (path) => {
  try {
    const b = readFileSync(path);
    if (b.length > 24 && b.toString('ascii', 12, 16) === 'IHDR') {
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    }
  } catch {}
  return null;
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
      dim: pngSize(join(IMG_DIR, file)),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.sort - b.sort);

reviews.forEach((r) => (r.highlight = HIGHLIGHT.includes(r.key)));
const ordered = [...reviews].reverse(); // newest first

const navHtml = ordered
  .map(
    (r) => `          <a class="qnav-link" href="#${esc(r.key)}">${esc(r.label)}${r.highlight ? ' <span class="qstar">★</span>' : ''}</a>`
  )
  .join('\n');

const reviewsHtml = ordered
  .map((r) => {
    const dim = r.dim ? ` width="${r.dim.w}" height="${r.dim.h}"` : '';
    return `      <figure id="${esc(r.key)}">
        <figcaption><span class="rlabel">${esc(r.label)}</span> <span class="rperiod">${esc(r.period)}</span> <span class="rating">${esc(r.rating)}</span></figcaption>
        <img loading="lazy" decoding="async"${dim} alt="${esc(r.label)} manager performance review (${esc(r.period)})" src="images/${esc(r.file)}" />
      </figure>`;
  })
  .join('\n');

const { linkedin, email } = PROFILE.links;
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
      --good: #15803d; --good-ink: #166534; --good-bg: #f0fdf4; --good-line: #bbf7d0; --good-accent: #16a34a;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0; background: #fff; color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5; -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 48px 24px 72px; }

    header.page { margin: 0 0 36px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
    header.page h1 { font-size: 27px; font-weight: 800; letter-spacing: -.02em; margin: 0; }
    header.page .role { margin: 7px 0 0; font-size: 15px; color: var(--muted); }

    .layout { display: grid; grid-template-columns: 164px 1fr; gap: 40px; align-items: start; }
    .side { position: sticky; top: 24px; }
    .qnav-title { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #9ca3af; font-weight: 700; margin: 0 0 8px 11px; }
    .qnav { display: flex; flex-direction: column; gap: 2px; }
    .qnav-link { display: flex; align-items: center; gap: 7px; text-decoration: none; color: var(--muted); font-size: 13.5px; font-weight: 500; padding: 7px 11px; border-radius: 8px; border-left: 2px solid transparent; transition: background .12s, color .12s; }
    .qnav-link:hover { color: var(--ink); background: var(--soft); }
    .qnav-link.active { color: var(--good-ink); background: var(--good-bg); border-left-color: var(--good-accent); font-weight: 700; }
    .qstar { color: var(--good); font-size: 11px; }

    .reviews { display: grid; gap: 38px; }
    figure { margin: 0; scroll-margin-top: 16px; }
    figcaption { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 14px; margin: 0 0 10px; }
    .rlabel { font-weight: 600; }
    .rperiod { color: var(--muted); }
    .rating { font-size: 11.5px; font-weight: 700; color: var(--muted); background: var(--soft); border: 1px solid var(--line); border-radius: 999px; padding: 2px 9px; }
    figure img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 10px; cursor: zoom-in; }

    footer { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--line); color: var(--muted); font-size: 13px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    footer a { color: var(--muted); text-decoration: none; }
    footer a:hover { color: var(--good); }

    /* Click-to-zoom preview */
    .lb { position: fixed; inset: 0; z-index: 100; background: rgba(12,14,18,.93); display: flex; flex-direction: column; }
    .lb[hidden] { display: none; }
    .lb-bar { display: flex; gap: 8px; justify-content: flex-end; padding: 12px 14px; }
    .lb-btn { min-width: 40px; height: 36px; padding: 0 12px; background: rgba(255,255,255,.12); color: #fff; border: 1px solid rgba(255,255,255,.22); border-radius: 8px; font-size: 16px; font-weight: 700; line-height: 1; cursor: pointer; }
    .lb-btn:hover { background: rgba(255,255,255,.24); }
    .lb-stage { flex: 1; overflow: auto; display: grid; place-items: center; padding: 0 14px 16px; }
    .lb-img { display: block; height: auto; max-width: none; cursor: zoom-in; }

    @media (max-width: 760px) {
      .layout { grid-template-columns: 1fr; gap: 18px; }
      .side { position: static; }
      .qnav-title { margin-left: 2px; }
      .qnav { flex-direction: row; flex-wrap: wrap; gap: 6px; }
      .qnav-link { border-left: 0; border: 1px solid var(--line); padding: 5px 10px; }
      .qnav-link.active { border-color: var(--good-line); }
    }
    @media (max-width: 560px) { .wrap { padding: 28px 14px 56px; } }
    @media print {
      .side, .lb { display: none; }
      .layout { grid-template-columns: 1fr; }
      figure, header.page { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="page">
      <h1>${esc(PROFILE.name)}</h1>
      <p class="role">${esc(PROFILE.title)}</p>
    </header>

    <div class="layout">
      <aside class="side">
        <div class="qnav-title">Quarters</div>
        <nav class="qnav" aria-label="Jump to quarter">
${navHtml}
        </nav>
      </aside>

      <main class="reviews">
${reviewsHtml}
      </main>
    </div>

    <footer>
      <span>© ${year} ${esc(PROFILE.name)}</span>
      <span><a href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:${email}">Email</a></span>
    </footer>
  </div>

  <div class="lb" id="lb" hidden aria-hidden="true">
    <div class="lb-bar">
      <button type="button" class="lb-btn" data-act="out" title="Zoom out" aria-label="Zoom out">−</button>
      <button type="button" class="lb-btn" data-act="in" title="Zoom in" aria-label="Zoom in">+</button>
      <button type="button" class="lb-btn" data-act="reset" title="Reset zoom">Reset</button>
      <button type="button" class="lb-btn" data-act="close" title="Close" aria-label="Close">✕</button>
    </div>
    <div class="lb-stage" id="lbStage"><img class="lb-img" id="lbImg" alt="" /></div>
  </div>

  <script>
    (function () {
      // Active quarter highlight in the left nav
      var links = Array.prototype.slice.call(document.querySelectorAll('.qnav-link'));
      if ('IntersectionObserver' in window && links.length) {
        var byId = {};
        links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (l) { l.classList.remove('active'); });
            var a = byId[e.target.id]; if (a) a.classList.add('active');
          });
        }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
        document.querySelectorAll('figure[id]').forEach(function (f) { obs.observe(f); });
      }

      // Click-to-zoom preview (buttons, wheel, drag-to-pan, Esc)
      var lb = document.getElementById('lb');
      var stage = document.getElementById('lbStage');
      var img = document.getElementById('lbImg');
      if (!lb) return;
      var zoom = 1, natW = 0, natH = 0, moved = false;

      function fit() {
        if (!natW || !natH) return 1;
        return Math.min(stage.clientWidth / natW, stage.clientHeight / natH, 1) * 0.98;
      }
      function apply() {
        img.style.width = (natW * fit() * zoom) + 'px';
        img.style.cursor = zoom > 1 ? 'grab' : 'zoom-in';
      }
      function setZoom(z) { zoom = Math.min(5, Math.max(1, z)); apply(); }
      function openLb(src, alt) {
        img.src = src; img.alt = alt || ''; zoom = 1;
        lb.hidden = false; lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (img.complete && img.naturalWidth) { natW = img.naturalWidth; natH = img.naturalHeight; apply(); }
      }
      function closeLb() {
        lb.hidden = true; lb.setAttribute('aria-hidden', 'true');
        img.src = ''; document.body.style.overflow = '';
      }
      img.addEventListener('load', function () { natW = img.naturalWidth; natH = img.naturalHeight; stage.scrollTo(0, 0); apply(); });

      document.querySelectorAll('.reviews figure img').forEach(function (im) {
        im.addEventListener('click', function () { openLb(im.currentSrc || im.src, im.alt); });
      });
      lb.querySelector('[data-act="in"]').addEventListener('click', function () { setZoom(zoom * 1.3); });
      lb.querySelector('[data-act="out"]').addEventListener('click', function () { setZoom(zoom / 1.3); });
      lb.querySelector('[data-act="reset"]').addEventListener('click', function () { setZoom(1); stage.scrollTo(0, 0); });
      lb.querySelector('[data-act="close"]').addEventListener('click', closeLb);
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target === stage) closeLb(); });
      img.addEventListener('click', function () { if (moved) { moved = false; return; } setZoom(zoom > 1 ? 1 : 2.2); });
      stage.addEventListener('wheel', function (e) { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.12 : 0.89)); }, { passive: false });
      document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') closeLb();
        else if (e.key === '+' || e.key === '=') setZoom(zoom * 1.3);
        else if (e.key === '-' || e.key === '_') setZoom(zoom / 1.3);
      });
      window.addEventListener('resize', function () { if (!lb.hidden) apply(); });

      // drag-to-pan while zoomed
      var down = false, sx, sy, sl, st;
      stage.addEventListener('mousedown', function (e) {
        if (zoom <= 1) return;
        down = true; moved = false; sx = e.clientX; sy = e.clientY; sl = stage.scrollLeft; st = stage.scrollTop; e.preventDefault();
      });
      window.addEventListener('mousemove', function (e) {
        if (!down) return;
        if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 4) moved = true;
        stage.scrollLeft = sl - (e.clientX - sx);
        stage.scrollTop = st - (e.clientY - sy);
      });
      window.addEventListener('mouseup', function () { down = false; });
    })();
  </script>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log('wrote', OUT, Buffer.byteLength(html), 'bytes ·', reviews.length, 'reviews (', reviews.filter((r) => r.highlight).length, 'flagged standout )');
