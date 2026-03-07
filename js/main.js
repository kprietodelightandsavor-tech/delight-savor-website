/* ============================================================
   DELIGHT & SAVOR — main.js
   Loads JSON data files and renders all sections of the homepage
   ============================================================ */

// ── Utility: fetch a local JSON file ──────────────────────────
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

// ── Utility: set inner HTML safely ────────────────────────────
function set(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHref(id, href) {
  const el = document.getElementById(id);
  if (el) el.href = href;
}

// ── Render: italic headline helper ───────────────────────────
function renderHeadline(h) {
  let out = '';
  if (h.plain)  out += h.plain;
  if (h.italic) out += `<em>${h.italic}</em>`;
  if (h.plain2) out += h.plain2;
  if (h.italic2)out += `<em>${h.italic2}</em>`;
  return out;
}

// ── Render: NAV ───────────────────────────────────────────────
function renderNav(data) {
  setText('brand-name', data.brand.name);
  setText('brand-tagline', data.brand.tagline);
  setText('footer-brand-name', data.brand.name);
  setText('footer-brand-tagline', data.brand.tagline);

  const socialIcons = { email: '✉', instagram: '◎', pinterest: '⊕', substack: '◈' };
  set('nav-social', data.social.map(s =>
    `<a href="${s.url}" title="${s.platform}" target="_blank" rel="noopener">${socialIcons[s.platform] || '●'}</a>`
  ).join(''));

  set('nav-links', data.links.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join(''));

  const cta = document.getElementById('nav-cta');
  if (cta) { cta.textContent = data.cta.label; cta.href = data.cta.href; }

  set('footer-links', data.footer_links.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join(''));

  set('footer-social', data.social.map(s =>
    `<a href="${s.url}" title="${s.platform}" target="_blank" rel="noopener">${s.handle || s.platform}</a>`
  ).join(''));

  setText('footer-copyright', data.copyright);
}

// ── Render: HERO ──────────────────────────────────────────────
function renderHero(data) {
  setText('hero-eyebrow', data.eyebrow);
  set('hero-headline', renderHeadline(data.headline));
  setText('hero-sub', data.subheadline);

  set('hero-buttons', data.buttons.map(b =>
    `<a class="btn btn-${b.style}" href="${b.href}">${b.label}</a>`
  ).join(''));

  const s = data.new_here_strip;
  const stepsHtml = s.steps.map(step => {
    const text = step.link_text
      ? step.text.replace(step.link_text, `<a href="${step.link_href}">${step.link_text}</a>`)
      : step.text;
    return `<div class="new-here-step"><span class="step-num">${step.number}</span>${text}</div>`;
  }).join('');

  set('new-here-strip', `
    <div class="new-here-inner">
      <span class="new-here-label">${s.label}</span>
      <div class="new-here-steps">${stepsHtml}</div>
    </div>
  `);
}

// ── Render: PHILOSOPHY ───────────────────────────────────────
function renderPhilosophy(data) {
  setText('phil-eyebrow', data.eyebrow);
  set('phil-title', renderHeadline(data.headline));
  set('phil-intro', data.intro);

  set('pillars-grid', data.pillars.map(p => `
    <div class="pillar">
      <div class="pillar-numeral">${p.numeral}</div>
      <div class="pillar-title">${p.title}</div>
      <p class="pillar-body">${p.body}</p>
    </div>
  `).join(''));

  set('philosophy-cta', `<a class="btn btn-outline" href="#philosophy-full">${data.cta.label}</a>`);

  const q = data.pull_quote;
  const quoteParts = q.text.split(q.highlight_word);
  const quoteHtml = quoteParts[0] + `<em>${q.highlight_word}</em>` + (quoteParts[1] || '');
  set('pull-quote-band', `
    <div class="pull-quote-inner">
      <p class="pull-quote-text">"${quoteHtml}"</p>
      <span class="pull-quote-label">${q.label}</span>
    </div>
  `);
}

// ── Render: CURRICULUM ───────────────────────────────────────
function renderCurriculum(data) {
  const yr = data.year_one;
  setText('curr-eyebrow', yr.eyebrow);
  set('curr-title', renderHeadline(yr.title));
  setText('curr-desc', yr.description);

  const b = yr.bundle;
  set('curriculum-bundle', `
    <span class="bundle-badge">${b.badge}</span>
    <p class="bundle-label">${b.label}</p>
    <h3 class="bundle-title">${b.title}</h3>
    <p class="bundle-subtitle">${b.subtitle}</p>
    <p class="bundle-desc">${b.description}</p>
    <ul class="bundle-includes">
      ${b.includes.map(i => `<li>${i}</li>`).join('')}
    </ul>
    <div class="version-tabs">
      ${b.versions.map(v => `<span class="version-tab">${v.label}</span>`).join('')}
    </div>
    <a class="btn btn-outline" href="${b.cta.href}" target="_blank">${b.cta.label}</a>
  `);

  set('curriculum-units', yr.units.map(u => `
    <div class="unit-card">
      <p class="unit-semester">${u.semester}</p>
      <h3 class="unit-title">${u.title}</h3>
      <p class="unit-author">${u.author} — ${u.grade}</p>
      <p class="unit-desc">${u.description}</p>
      <ul class="unit-includes">
        ${u.includes.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <div class="version-tabs">
        ${u.versions.map(v => `<span class="version-tab">${v.label}</span>`).join('')}
      </div>
      <a class="btn btn-outline" href="${u.cta.href}" target="_blank">${u.cta.label}</a>
    </div>
  `).join(''));
}

// ── Render: ABOUT STRIP ───────────────────────────────────────
function renderAbout(data) {
  const strip = data.homepage_strip;
  setText('about-tagline', strip.tagline);
  set('about-credentials', strip.credentials.map(c =>
    `<span class="credential-tag">${c}</span>`
  ).join(''));
  const cta = document.getElementById('about-cta');
  if (cta) { cta.textContent = strip.cta.label; cta.href = strip.cta.href; }
}

// ── Render: TESTIMONIALS ──────────────────────────────────────
function renderTestimonials(data) {
  set('test-eyebrow', `<span>${data.eyebrow}</span>`);
  set('test-title', renderHeadline(data.headline));

  set('testimonials-grid', data.testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-mark">"</div>
      <p class="testimonial-quote">${t.quote}</p>
      <p class="testimonial-role">${t.role}</p>
      <p class="testimonial-context">${t.context}</p>
    </div>
  `).join(''));
}

// ── Render: CHARLOTTE MASON ───────────────────────────────────
function renderCM(data) {
  setText('cm-eyebrow', data.eyebrow);
  set('cm-title', renderHeadline(data.headline));

  set('cm-paragraphs', data.paragraphs.map(p => `<p>${p}</p>`).join(''));

  set('cm-quote-box', `
    <p class="cm-quote-text">"${data.quote.text}"</p>
    <p class="cm-quote-attr">— ${data.quote.attribution}</p>
  `);

  set('cm-tags', data.tags.map(t => `<span class="cm-tag">${t}</span>`).join(''));
}

// ── Render: TEACHER'S NOTEBOOK PREVIEW ───────────────────────
function renderNotebookPreview(data) {
  const preview = data.notes.slice(0, 3);
  set('notebook-cards', preview.map(n => `
    <div class="notebook-card">
      <span class="notebook-card-category">${n.category}</span>
      <h4 class="notebook-card-title">${n.title}</h4>
      <p class="notebook-card-summary">${n.summary}</p>
      <a class="notebook-card-link" href="teachers-notebook.html#note-${n.id}">Read the Note →</a>
    </div>
  `).join(''));
}

// ── Render: FAQ ───────────────────────────────────────────────
function renderFAQ(data) {
  setText('faq-eyebrow', data.eyebrow);
  setText('faq-title', data.title);

  set('faq-list', data.items.map((item, i) => `
    <div class="faq-item">
      <button class="faq-question" data-index="${i}">
        ${item.question}
        <span class="faq-icon"></span>
      </button>
      <div class="faq-answer">${item.answer}</div>
    </div>
  `).join(''));

  // Accordion behavior
  document.getElementById('faq-list').addEventListener('click', e => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-question.open').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling.classList.remove('open');
    });
    // Open clicked if it was closed
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
}

// ── Render: COMING SOON ───────────────────────────────────────
function renderComingSoon(data) {
  setText('cs-eyebrow', data.eyebrow);
  set('cs-title', renderHeadline(data.headline));
  setText('cs-desc', data.description);

  set('coming-grid', data.units.map(u => `
    <div class="coming-card">
      <div class="coming-card-header">
        <span class="coming-category">${u.category}</span>
        <span class="coming-badge">${u.badge}</span>
      </div>
      <h3 class="coming-title">${u.title}</h3>
      <p class="coming-subtitle">${u.subtitle}</p>
      <div class="coming-cover">
        <div class="coming-cover-inner">Delight & Savor<br>Living Literature & Language Series</div>
      </div>
      <p class="coming-desc">${u.description}</p>
      <p class="coming-versions">${u.versions}</p>
    </div>
  `).join(''));
}

// ── Render: JOURNAL ───────────────────────────────────────────
function renderJournal(data) {
  set('journal-eyebrow', `<span>${data.eyebrow}</span>`);
  set('journal-title', renderHeadline(data.headline));
  setText('journal-desc', data.description);
  setHref('journal-cta', data.cta_primary.href);
  set('journal-substack', `Visit our Substack to read the latest essays.`);
  setHref('journal-substack', data.cta_secondary.href);
}

// ── Render: EMAIL SIGNUP ──────────────────────────────────────
function renderSignup(data) {
  set('signup-eyebrow', `<span>${data.eyebrow}</span>`);
  setText('signup-headline', data.headline);
  setText('signup-desc', data.description);
  const cta = document.getElementById('signup-cta');
  if (cta) { cta.textContent = data.cta.label; cta.href = data.cta.href; }
}

// ── Render: CONTACT ───────────────────────────────────────────
function renderContact(data) {
  const icons = { envelope: '✉', instagram: '◎', 'book-open': '◈', pinterest: '⊕' };
  set('contact-eyebrow', `<span>${data.eyebrow}</span>`);
  set('contact-title', renderHeadline(data.headline));
  setText('contact-desc', data.description);

  set('contact-grid', data.channels.map(c => `
    <a class="contact-card" href="${c.href}" target="_blank" rel="noopener">
      <div class="contact-icon">${icons[c.icon] || '●'}</div>
      <div class="contact-label">${c.label}</div>
      <div class="contact-detail">${c.detail}</div>
    </a>
  `).join(''));
}

// ── INIT: Load all JSON and render ────────────────────────────
async function init() {
  const base = './data/';
  try {
    const [nav, hero, phil, curr, about, test, cm, notebook, faq, cs, journal, signup, contact] = await Promise.all([
      loadJSON(base + 'nav.json'),
      loadJSON(base + 'hero.json'),
      loadJSON(base + 'philosophy.json'),
      loadJSON(base + 'curriculum.json'),
      loadJSON(base + 'about.json'),
      loadJSON(base + 'testimonials.json'),
      loadJSON(base + 'charlotte_mason.json'),
      loadJSON(base + 'teachers_notebook.json'),
      loadJSON(base + 'faq.json'),
      loadJSON(base + 'coming_soon.json'),
      loadJSON(base + 'journal.json'),
      loadJSON(base + 'email_signup.json'),
      loadJSON(base + 'contact.json'),
    ]);

    renderNav(nav);
    renderHero(hero);
    renderPhilosophy(phil);
    renderCurriculum(curr);
    renderAbout(about);
    renderTestimonials(test);
    renderCM(cm);
    renderNotebookPreview(notebook);
    renderFAQ(faq);
    renderComingSoon(cs);
    renderJournal(journal);
    renderSignup(signup);
    renderContact(contact);

  } catch (err) {
    console.error('Error loading site data:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
