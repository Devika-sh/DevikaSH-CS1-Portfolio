'use strict';

/* ==========================================================================
   1. DATA — projects & skills stored as arrays of objects (B1)
   Edit these arrays with your own work; the DOM is rendered from them,
   nothing is hardcoded in the HTML.
   ========================================================================== */
const projects = [
  {
    id: 'paisaonclick',
    title: 'PaisaOnClick — Fintech App &amp; Landing Page',
    description:
      'Complete mobile app UI and investor-facing landing page for an AI-powered digital lending marketplace, delivered as end-to-end Figma prototypes for a freelance client.',
    image: 'images/project-paisaonclick.svg',
    tech: ['UI Design', 'Figma', 'Fintech'],
    links: [
      { label: 'Figma prototype ↗', url: 'https://reach-heavy-48188345.figma.site/' },
      { label: 'View on Behance ↗', url: 'https://www.behance.net/devika-sh' },
    ],
  },
  {
    id: 'elevate-series',
    title: 'ELEVATE Series — People Leadership Conclave',
    description:
      'Led design and visual branding for the ELEVATE people-leadership conclave, organised by HR Evolve — the Technopark HR networking initiative run with GTech and µLearn.',
    image: 'images/project-elevate.svg',
    tech: ['Visual Branding', 'Event Design'],
    links: [{ label: 'View on Behance ↗', url: 'https://www.behance.net/devika-sh' }],
  },
  {
    id: 'design-unlocked',
    title: 'Design Unlocked — State-Level Design Bootcamp',
    description:
      'Handled all design assets for a state-level design bootcamp and designathon, co-hosted by Catalyst IEDC and µLearn MBCET.',
    image: 'images/project-design-unlocked.svg',
    tech: ['Graphic Design', 'Event Design'],
    links: [{ label: 'View on Behance ↗', url: 'https://www.behance.net/devika-sh' }],
  },
  {
    id: 'usprint-2025',
    title: 'µSprint 2025 — 30-Day Online Challenge',
    description:
      'Design lead for µSprint 2025, a 30-day online habit-building challenge focused on consistency, portfolio development, and community-driven engagement.',
    image: 'images/project-usprint.svg',
    tech: ['Social Media Design', 'Graphic Design'],
    links: [{ label: 'View on Behance ↗', url: 'https://www.behance.net/devika-sh' }],
  },
];

const skillsList = [
  { name: 'Figma', glyph: 'Fg' },
  { name: 'Canva', glyph: 'Cv' },
  { name: 'UI Design', glyph: 'UI' },
  { name: 'UX Design', glyph: 'UX' },
  { name: 'Wireframing', glyph: 'Wf' },
  { name: 'Prototyping', glyph: 'Pt' },
  { name: 'Visual Branding', glyph: 'Vb' },
  { name: 'Social Media Design', glyph: 'Sm' },
];

/* ==========================================================================
   2. DOM RENDERING — build Skills tiles & Project cards from the data above
   ========================================================================== */
const renderSkills = () => {
  const list = document.getElementById('skill-tools');
  if (!list) return;

  // array.map + template literals, then join into one DOM write
  list.innerHTML = skillsList
    .map(
      ({ name, glyph }) => `
      <li class="skill-tile">
        <div class="skill-glyph" aria-hidden="true">${glyph}</div>
        <span class="skill-name">${name}</span>
      </li>`
    )
    .join('');
};

const projectCardTemplate = ({ id, title, description, image, tech, links }) => `
  <article class="project-card" data-id="${id}" data-tech="${tech.join(',')}">
    <img src="${image}" alt="${title} project thumbnail" loading="lazy">
    <div class="project-card-body">
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="tag-list">
        ${tech.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="project-links">
        ${links
          .map(({ label, url }) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`)
          .join('')}
      </div>
    </div>
  </article>`;

const renderProjects = (list = projects) => {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  grid.innerHTML = list.length
    ? list.map(projectCardTemplate).join('')
    : '<p>No projects match that filter yet.</p>';
};

const renderFilterBar = () => {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;

  // Build a de-duplicated technology list with a Set + spread (B5)
  const allTech = [...new Set(projects.flatMap((p) => p.tech))];
  const chips = ['All', ...allTech];

  bar.innerHTML = chips
    .map(
      (tech, i) =>
        `<button type="button" class="filter-chip${i === 0 ? ' active' : ''}" data-filter="${tech}">${tech}</button>`
    )
    .join('');

  bar.addEventListener('click', (event) => {
    const chip = event.target.closest('.filter-chip');
    if (!chip) return;

    bar.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');

    const { filter } = chip.dataset;
    const filtered = filter === 'All' ? projects : projects.filter((p) => p.tech.includes(filter));
    renderProjects(filtered);
  });
};

/* ==========================================================================
   3. EVENT HANDLING — interactive UI behaviours (B2)
   ========================================================================== */

// --- Behaviour 1: mobile hamburger nav toggle ---------------------------
const initNavToggle = () => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after choosing a link (nice-to-have UX, still an event handler)
  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
};

// --- Behaviour 2: dark / light theme switch, persisted (B2 + B4) --------
const THEME_KEY = 'portfolio-theme';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  const toggle = document.getElementById('theme-toggle');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
};

const initThemeToggle = () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Restore saved preference on load (browser storage requirement, B4)
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
};

// --- Behaviour 3 (bonus): fixed scroll-to-top button -------------------
const initScrollTopButton = () => {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// --- Live clock in the hero "widget" (small extra DOM touch) -----------
const initLiveClock = () => {
  const clock = document.getElementById('live-clock');
  if (!clock) return;

  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${hh}:${mm}`;
  };

  tick();
  setInterval(tick, 1000 * 30);
};

/* ==========================================================================
   4. CONTACT FORM VALIDATION — regex, inline messages, no reload (B3)
   ========================================================================== */
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('name'),
      msg: document.getElementById('name-msg'),
      pattern: /^[A-Za-z][A-Za-z\s.'-]{1,49}$/,
      error: 'Enter your name (letters only, 2–50 characters).',
    },
    email: {
      input: document.getElementById('email'),
      msg: document.getElementById('email-msg'),
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      error: 'Enter a valid email address, e.g. name@example.com.',
    },
    message: {
      input: document.getElementById('message'),
      msg: document.getElementById('message-msg'),
      pattern: /^.{10,1000}$/s,
      error: 'Message should be at least 10 characters long.',
    },
  };

  const successMsg = document.getElementById('form-success');

  // Validates a single field and updates its inline message; returns boolean
  const validateField = (key) => {
    const { input, msg, pattern, error } = fields[key];
    const value = input.value.trim();
    const isValid = pattern.test(value);

    input.closest('.form-row').classList.toggle('invalid', !isValid);
    msg.textContent = isValid ? '' : error;

    return isValid;
  };

  // Validate as the user types (destructure keys via Object.keys + forEach)
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('input', () => validateField(key));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // no page reload

    // array.every-style check across all fields using .map + every
    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      successMsg.textContent = '';
      return;
    }

    // In a real deployment this would call a backend / email API.
    // For this static-site assignment we simply confirm success.
    successMsg.textContent = `Thanks, ${fields.name.input.value.trim()} — your message is ready to send. (Hook this up to a real endpoint or mailto: before going live.)`;
    form.reset();
    Object.values(fields).forEach(({ input }) => input.closest('.form-row').classList.remove('invalid'));
  });
};

/* ==========================================================================
   5. INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderFilterBar();
  renderProjects();

  initNavToggle();
  initThemeToggle();
  initScrollTopButton();
  initLiveClock();
  initContactForm();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
