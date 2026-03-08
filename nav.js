/* ─── DELIGHT & SAVOR · Shared Nav Component ─────────────────
   Injects header + social bar, handles click-toggle dropdown,
   marks active page link, and handles newsletter form.
   Include at bottom of <body> on every page.
──────────────────────────────────────────────────────────── */

(function () {
  /* ── Determine active page ── */
  const page = location.pathname.split('/').pop() || 'index.html';

  function navLink(href, label) {
    const active = page === href ? ' class="active"' : '';
    return `<li role="none"><a href="${href}" role="menuitem"${active}>${label}</a></li>`;
  }

  /* ── Header HTML ── */
  const headerHTML = `
<header class="site-header" role="banner">
  <div class="header-inner">
    <a href="index.html" class="logo">Delight <span>&amp;</span> Savor</a>
    <nav class="nav-wrap" aria-label="Primary navigation">
      <div class="dropdown" id="siteDropdown">
        <button class="dropdown-btn" id="dropdownBtn" aria-expanded="false" aria-haspopup="true">
          Menu
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>
        </button>
        <ul class="dropdown-menu" id="dropdownMenu" role="menu">
          ${navLink('philosophy.html','Philosophy')}
          ${navLink('curriculum.html','Curriculum')}
          ${navLink('teachers-notebook.html','Teacher\'s Notebook')}
          ${navLink('faq.html','FAQ')}
        </ul>
      </div>
      <a href="curriculum.html" class="btn-shopnow">Shop Now</a>
    </nav>
  </div>
</header>

<div class="social-bar" role="complementary" aria-label="Social media links">
  <div class="social-bar-inner">
    <a href="https://instagram.com/Kim.delightandsavor" class="social-link" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
      Instagram
    </a>
    <a href="https://pinterest.com" class="social-link" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.563 0-2.387-1.715-4.055-4.163-4.055-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 01.069.286c-.076.315-.245 1-.278 1.139-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
      Pinterest
    </a>
    <a href="https://delightandsavor.substack.com" class="social-link" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
      Substack
    </a>
  </div>
</div>`;

  /* ── Footer HTML ── */
  const footerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">Delight <span style="color:var(--gold)">&amp;</span> Savor</div>
        <p class="footer-tagline">Charlotte Mason upper-level literature and language arts for the student who is ready to read deeply.</p>
      </div>
      <div>
        <p class="footer-col-title">Navigate</p>
        <ul class="footer-nav-list">
          <li><a href="philosophy.html">Philosophy</a></li>
          <li><a href="curriculum.html">Curriculum</a></li>
          <li><a href="teachers-notebook.html">Teacher's Notebook</a></li>
          <li><a href="curriculum.html">Shop</a></li>
          <li><a href="faq.html">FAQ</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">Connect</p>
        <ul class="footer-social-list">
          <li><a href="https://instagram.com/Kim.delightandsavor" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram</a></li>
          <li><a href="https://pinterest.com" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.563 0-2.387-1.715-4.055-4.163-4.055-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 01.069.286c-.076.315-.245 1-.278 1.139-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
            Pinterest</a></li>
          <li><a href="https://delightandsavor.substack.com" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
            Substack</a></li>
          <li><a href="mailto:kprieto.delightandsavor@gmail.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email Us</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">From the Ranch &amp; the Desk</p>
        <p class="newsletter-desc">One monthly letter: what I'm teaching, what I'm reading, and what's new in the shop.</p>
        <form onsubmit="handleNewsletter(event)" aria-label="Newsletter signup">
          <div class="newsletter-input-wrap">
            <label for="footer-email" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Email</label>
            <input type="email" id="footer-email" class="newsletter-input" placeholder="your@email.com" required autocomplete="email" />
            <button type="submit" class="newsletter-submit">Subscribe</button>
          </div>
          <p id="newsletter-msg" style="font-family:var(--ff-body);font-size:.82rem;color:var(--sage);margin-top:.6rem;min-height:1.2em"></p>
        </form>
      </div>
    </div>
    <hr class="footer-divider" />
    <div class="footer-bottom">
      <p class="footer-copy">&copy; <span class="js-year"></span> Delight &amp; Savor Press · All rights reserved · All digital sales final.</p>
      <nav class="footer-bottom-links">
        <a href="faq.html#returns">Returns Policy</a>
        <a href="faq.html#contact">Contact</a>
      </nav>
    </div>
  </div>
</footer>`;

  /* ── Inject header before first child of body ── */
  const body = document.body;
  const firstChild = body.firstElementChild;
  const headerWrap = document.createElement('div');
  headerWrap.innerHTML = headerHTML;
  body.insertBefore(headerWrap, firstChild);

  /* ── Inject footer ── */
  const footerWrap = document.createElement('div');
  footerWrap.innerHTML = footerHTML;
  body.appendChild(footerWrap);

  /* ── Click-toggle dropdown (fixes hover gap bug) ── */
  const btn  = document.getElementById('dropdownBtn');
  const menu = document.getElementById('dropdownMenu');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking outside
  document.addEventListener('click', function () {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Copyright year ── */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ── Newsletter ── */
  window.handleNewsletter = function (e) {
    e.preventDefault();
    const msg   = document.getElementById('newsletter-msg');
    const input = document.getElementById('footer-email');
    if (msg) msg.textContent = 'Thank you! You\'ll hear from us soon. ✦';
    if (input) input.value = '';
  };
})();
