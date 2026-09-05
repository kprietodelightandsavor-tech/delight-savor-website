/* ─── Delight & Savor · Shared Nav ───────────────────────────
   Injects header + footer, marks active page, handles mobile menu.
──────────────────────────────────────────────────────────── */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  function isActive(href) {
    return page === href || page === href.replace('.html','') ? ' class="active"' : '';
  }
  /* ── NAV HTML ── */
  const navHTML = `
<nav>
  <a href="index.html" class="nav-logo-wrap">
    <img src="images/web-app-manifest-192x192.png" alt="Delight &amp; Savor" class="nav-logo-img" />
    <div class="nav-logo-text">
      Delight &amp; Savor
      <span>Beauty. Meaning. Connection.</span>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="philosophy.html"${isActive('philosophy.html')}>Philosophy</a></li>
    <li><a href="curriculum.html"${isActive('curriculum.html')}>Curriculum</a></li>
    <li><a href="teachers-notebook.html"${isActive('teachers-notebook.html')}>Teacher&rsquo;s Notebook</a></li>
    <li><a href="faq.html"${isActive('faq.html')}>FAQ</a></li>
    <li><a href="conversation-quilt.html"${isActive('conversation-quilt.html')}>Conversation Quilt</a></li>
    <li><a href="Shop.html" class="nav-cta">Shop Now</a></li>
  </ul>
  <div class="nav-social">
    <a href="https://instagram.com/Kim.delightandsavor" target="_blank" rel="noopener">Instagram</a>
    <a href="https://pinterest.com" target="_blank" rel="noopener">Pinterest</a>
    <a href="https://delightandsavor.substack.com" target="_blank" rel="noopener">Substack</a>
  </div>
  <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-nav" id="mobile-nav">
  <a href="philosophy.html" onclick="toggleMenu()">Philosophy</a>
  <a href="curriculum.html" onclick="toggleMenu()">Curriculum</a>
  <a href="teachers-notebook.html" onclick="toggleMenu()">Teacher&rsquo;s Notebook</a>
  <a href="faq.html" onclick="toggleMenu()">FAQ</a>
  <a href="conversation-quilt.html" onclick="toggleMenu()">Conversation Quilt</a>
  <a href="lately.html" onclick="toggleMenu()">Lately</a>
  <a href="podcast.html" onclick="toggleMenu()">Podcast</a>
  <div class="mobile-divider"></div>
  <a href="https://instagram.com/Kim.delightandsavor" target="_blank" rel="noopener" onclick="toggleMenu()">Instagram</a>
  <a href="https://delightandsavor.substack.com" target="_blank" rel="noopener" onclick="toggleMenu()">Substack</a>
  <div class="mobile-divider"></div>
  <a href="Shop.html" class="mobile-cta" onclick="toggleMenu()">Shop Now &rarr;</a>
</div>`;
 /* ── INJECT FAVICON + APPLE TOUCH ICON ── */
[
  { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'images/favicon-96x96.png' },
  { rel: 'shortcut icon', href: 'images/favicon.ico' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: 'images/apple-touch-icon.png' },
  { rel: 'manifest', href: 'images/site.webmanifest' }
].forEach(function (i) {
  const link = document.createElement('link');
  Object.keys(i).forEach(function (k) { link.setAttribute(k, i[k]); });
  document.head.appendChild(link);
});
   /* ── NAV CSS ── */
  const navCSS = `
    nav { background: var(--ds-paper); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; height: 68px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 0 var(--ds-rule); }

    /* The bar rule above targets every <nav>; footers contain navs too.
       Without this they inherit the 68px sticky paper bar. */
    footer nav { background: none; padding: 0; display: block; height: auto;
      position: static; box-shadow: none; gap: 0; }
    .nav-logo-wrap { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; flex: 0 0 auto; }
    .nav-logo-img { height: 40px; width: auto; opacity: 0.95; }
    .nav-logo-text { font-family: 'Playfair Display', serif; color: var(--ds-juniper); font-size: 1rem; letter-spacing: 0.04em; line-height: 1.2; }
    .nav-logo-text span { display: block; font-size: 0.698rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ds-sage-text); font-family: 'Cormorant Garamond', serif; font-style: italic; }
    .nav-links { list-style: none; display: flex; gap: clamp(0.85rem, 1.5vw, 1.6rem); align-items: center; flex-wrap: nowrap; margin: 0; padding: 0; }
    .nav-links a { color: var(--ds-ink-soft); font-size: 0.82rem; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; text-decoration: none; white-space: nowrap; }
    .nav-links a:hover, .nav-links a.active { color: var(--ds-juniper); }
    .nav-cta { background: var(--ds-ochre); color: var(--ds-ink) !important; padding: 0.4rem 1.1rem; border-radius: 2px; font-weight: 600; white-space: nowrap; }
    .nav-social { display: flex; gap: 1rem; align-items: center; flex: 0 0 auto; }
    .nav-social a { color: var(--ds-sage-text); font-size: 0.785rem; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; text-decoration: none; white-space: nowrap; }
    .nav-social a:hover { color: var(--ds-juniper); }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .hamburger span { display: block; width: 24px; height: 2px; background: var(--ds-juniper); border-radius: 2px; transition: all .25s; }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-nav { display: none; position: fixed; top: 68px; left: 0; right: 0; background: var(--ds-paper); border-top: 1px solid var(--ds-rule); padding: 1rem 2rem 1.5rem; z-index: 99; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .mobile-nav.open { display: flex; }
    .mobile-nav a { color: var(--ds-ink-soft); font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.85rem 0; border-bottom: 1px solid var(--ds-rule); transition: color 0.2s; text-decoration: none; }
    .mobile-nav a:last-child { border-bottom: none; }
    .mobile-nav a:hover { color: var(--ds-juniper); }
    .mobile-nav a.mobile-cta { color: var(--ds-juniper); font-weight: 600; }
    .mobile-nav .mobile-divider { height: 1px; background: var(--ds-rule); margin: 0.5rem 0; }
    /* Social links are secondary — drop them before the primary links run out of room. */
    @media (max-width: 1420px) { .nav-social { display: none; } }
    /* Below this the primary links genuinely no longer fit; use the menu. */
    @media (max-width: 1160px) { .nav-links { display: none; } .nav-social { display: none; } .hamburger { display: flex; } }
    /* Very narrow phones: tighten the logo lockup so it never wraps against the menu button. */
    @media (max-width: 400px) { nav { padding: 0 1rem; } .nav-logo-img { height: 32px; } .nav-logo-text { font-size: 0.9rem; } .nav-logo-text span { font-size: 0.632rem; letter-spacing: 0.07em; } }

    /* ── FOOTER ── */
    footer { background: var(--ds-paper-deep); color: var(--ds-ink); border-top: 1px solid var(--ds-rule-strong); font-family: 'Lato', system-ui, sans-serif; padding: 56px 2rem 28px; margin-top: 60px; }
    .footer-inner { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 48px; align-items: start; }
    .footer-brand .footer-logo { height: 46px; width: auto; margin-bottom: 14px; opacity: .95; }
    .footer-brand p { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; line-height: 1.5; color: var(--ds-ink); margin: 0 0 18px; max-width: 38ch; }
    .footer-email p { font-size: 0.8rem; letter-spacing: 0.04em; color: var(--ds-ink-soft); margin: 0 0 8px; }
    .footer-email-row { display: flex; gap: 8px; max-width: 320px; }
    .footer-email-row input { flex: 1; min-width: 0; padding: 9px 12px; border: 1px solid var(--ds-rule-strong); border-radius: 4px; background: var(--ds-paper-warm); color: var(--ds-paper); font-size: 0.82rem; }
    .footer-email-row input::placeholder { color: var(--ds-ink-soft); }
    .footer-email-row button { padding: 9px 16px; border: none; border-radius: 4px; background: var(--ds-juniper); color: var(--ds-paper); font-weight: 700; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background .2s; }
    .footer-email-row button:hover { background: var(--ds-ochre-lt); }
    footer h4 { font-family: 'Lato', system-ui, sans-serif; font-size: 0.8rem; letter-spacing: 0.115em; text-transform: uppercase; color: var(--ds-juniper); margin: 0 0 14px; font-weight: 700; }
    .footer-nav ul, .footer-connect ul { list-style: none; margin: 0; padding: 0; }
    .footer-nav li, .footer-connect li { margin-bottom: 9px; }
    .footer-nav a, .footer-connect a { color: var(--ds-ink); text-decoration: none; font-size: 0.86rem; letter-spacing: 0.03em; transition: color .2s; }
    .footer-nav a:hover, .footer-connect a:hover { color: var(--ds-juniper); }
    /* ── Also from D&S (family apps) ── */
    .footer-apps { max-width: 1120px; margin: 40px auto 0; padding-top: 28px; border-top: 1px solid var(--ds-rule); text-align: center; }
    .footer-apps p { font-family: 'Cormorant Garamond', serif; font-variant: small-caps; letter-spacing: 0.13em; font-size: 0.8rem; color: var(--ds-ink-soft); margin: 0 0 16px; }
    .footer-apps-row { display: flex; gap: 2.75rem; justify-content: center; align-items: flex-start; flex-wrap: wrap; }
    .footer-apps-row a { display: inline-flex; flex-direction: column; align-items: center; gap: .55rem; text-decoration: none; color: var(--ds-ink-soft); font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; letter-spacing: 0.02em; transition: color .2s; }
    .footer-apps-row a:hover { color: var(--ds-paper); }
    .footer-apps-row img { display: block; width: 52px; height: 52px; border-radius: 11px; }
    .footer-bottom { max-width: 1120px; margin: 36px auto 0; padding-top: 20px; border-top: 1px solid var(--ds-rule); display: flex; flex-wrap: wrap; gap: 10px 20px; justify-content: space-between; font-size: 0.785rem; letter-spacing: 0.03em; color: var(--ds-ink-soft); }
    .footer-bottom a { color: var(--ds-ink-soft); text-decoration: none; }
    .footer-bottom a:hover { color: var(--ds-juniper); }
    @media (max-width: 720px) { .footer-inner { grid-template-columns: minmax(0, 1fr); gap: 34px; } footer { padding: 44px 1.5rem 24px; } .footer-bottom { justify-content: flex-start; } }
    /* An <input>'s intrinsic width kept the subscribe row from shrinking, which pushed
       the whole footer wider than narrow phones. Stack it instead. */
    @media (max-width: 430px) { .footer-email-row { flex-wrap: wrap; } .footer-email-row input, .footer-email-row button { flex: 1 1 100%; } }`;
  /* ── FOOTER HTML ── */
  const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="images/web-app-manifest-192x192.png" alt="Delight &amp; Savor" class="footer-logo" />
      <p>Charlotte Mason upper-level literature and language arts for the student who is ready to read deeply.</p>
      <div class="footer-email">
        <p>From the Ranch &amp; the Desk &mdash; one monthly letter.</p>
        <div class="footer-email-row">
          <input type="email" placeholder="Email address" />
          <button type="button">Subscribe</button>
        </div>
      </div>
    </div>
    <nav class="footer-nav">
      <h4>Navigate</h4>
      <ul>
        <li><a href="philosophy.html">Philosophy</a></li>
        <li><a href="curriculum.html">Curriculum</a></li>
        <li><a href="teachers-notebook.html">Teacher&rsquo;s Notebook</a></li>
        <li><a href="conversation-quilt.html">Conversation Quilt</a></li>
        <li><a href="lately.html">Lately</a></li>
        <li><a href="podcast.html">Podcast</a></li>
        <li><a href="Shop.html">Shop</a></li>
        <li><a href="faq.html">FAQ</a></li>
      </ul>
    </nav>
    <div class="footer-connect">
      <h4>Connect</h4>
      <ul>
        <li><a href="https://instagram.com/Kim.delightandsavor" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://pinterest.com" target="_blank" rel="noopener">Pinterest</a></li>
        <li><a href="https://delightandsavor.substack.com" target="_blank" rel="noopener">Substack</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-apps">
    <p>Also from Delight &amp; Savor</p>
    <div class="footer-apps-row">
      <a href="https://in-the-margin.netlify.app" target="_blank" rel="noopener">
        <img src="images/margin_logo-rounded-512.png" alt="In the Margin app icon" />
        In the Margin
      </a>
      <a href="https://tend-ds.netlify.app" target="_blank" rel="noopener">
        <img src="images/tend_logo-rounded-512.png" alt="Tend app icon" />
        Tend
      </a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; ${new Date().getFullYear()} Delight &amp; Savor Press &middot; All rights reserved &middot; All digital sales final.</span>
    <span><a href="faq.html#returns">Returns Policy</a> &nbsp;&middot;&nbsp; <a href="faq.html#contact">Contact</a></span>
  </div>
</footer>`;
  /* ── INJECT NAV CSS ── */
  const style = document.createElement('style');
  style.textContent = navCSS;
  document.head.appendChild(style);
  /* ── INJECT NAV ── */
  const navWrap = document.createElement('div');
  navWrap.innerHTML = navHTML;
  document.body.insertBefore(navWrap, document.body.firstChild);
  /* ── INJECT FOOTER ── */
  const footerWrap = document.createElement('div');
  footerWrap.innerHTML = footerHTML;
  document.body.appendChild(footerWrap);
  /* ── MOBILE MENU ── */
  window.toggleMenu = function() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mobile-nav');
    if (btn && nav) {
      btn.classList.toggle('open');
      nav.classList.toggle('open');
    }
  };
  document.addEventListener('click', function(e) {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mobile-nav');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && btn && !btn.contains(e.target)) {
      btn.classList.remove('open');
      nav.classList.remove('open');
    }
  });
})();
