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
    <img src="/images/ds_icon.png" alt="Delight &amp; Savor" class="nav-logo-img" />
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
    <li><a href="curriculum.html" class="nav-cta">Shop Now</a></li>
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
  <div class="mobile-divider"></div>
  <a href="https://instagram.com/Kim.delightandsavor" target="_blank" rel="noopener" onclick="toggleMenu()">Instagram</a>
  <a href="https://delightandsavor.substack.com" target="_blank" rel="noopener" onclick="toggleMenu()">Substack</a>
  <div class="mobile-divider"></div>
  <a href="curriculum.html" class="mobile-cta" onclick="toggleMenu()">Shop Now &rarr;</a>
</div>`;

 /* ── INJECT FAVICON + APPLE TOUCH ICON ── */
[
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' },
  { rel: 'icon', href: '/images/favicon.ico', sizes: 'any' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' }
].forEach(function (i) {
  const link = document.createElement('link');
  Object.keys(i).forEach(function (k) { link.setAttribute(k, i[k]); });
  document.head.appendChild(link);
});
   /* ── NAV CSS ── */
  const navCSS = `
    nav { background: #2d3748; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 68px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 16px rgba(0,0,0,.25); }
    .nav-logo-wrap { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; }
    .nav-logo-img { height: 40px; width: auto; opacity: 0.95; }
    .nav-logo-text { font-family: 'Playfair Display', serif; color: #faf9f6; font-size: 1rem; letter-spacing: 0.04em; line-height: 1.2; }
    .nav-logo-text span { display: block; font-size: 0.52rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,213,176,0.45); font-family: 'Cormorant Garamond', serif; font-style: italic; }
    .nav-links { list-style: none; display: flex; gap: 2rem; align-items: center; }
    .nav-links a { color: rgba(250,249,246,0.82); font-size: 0.82rem; letter-spacing: 0.07em; text-transform: uppercase; transition: color 0.2s; text-decoration: none; }
    .nav-links a:hover, .nav-links a.active { color: #E8D5B0; }
    .nav-cta { background: #C29B61; color: #faf9f6 !important; padding: 0.4rem 1.1rem; border-radius: 2px; font-weight: 600; }
    .nav-social { display: flex; gap: 1.25rem; align-items: center; }
    .nav-social a { color: rgba(250,249,246,0.52); font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; text-decoration: none; }
    .nav-social a:hover { color: #E8D5B0; }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .hamburger span { display: block; width: 24px; height: 2px; background: #faf9f6; border-radius: 2px; transition: all .25s; }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-nav { display: none; position: fixed; top: 68px; left: 0; right: 0; background: #2d3748; border-top: 1px solid rgba(255,255,255,0.1); padding: 1rem 2rem 1.5rem; z-index: 99; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
    .mobile-nav.open { display: flex; }
    .mobile-nav a { color: rgba(250,249,246,0.75); font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.85rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); transition: color 0.2s; text-decoration: none; }
    .mobile-nav a:last-child { border-bottom: none; }
    .mobile-nav a:hover { color: #E8D5B0; }
    .mobile-nav a.mobile-cta { color: #E8D5B0; font-weight: 600; }
    .mobile-nav .mobile-divider { height: 1px; background: rgba(255,255,255,0.12); margin: 0.5rem 0; }
    @media (max-width: 720px) { .nav-links { display: none; } .nav-social { display: none; } .hamburger { display: flex; } }`;

  /* ── FOOTER HTML ── */
  const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="/images/ds_icon.png" alt="Delight &amp; Savor" class="footer-logo" />
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
        <li><a href="https://delightnsavor.gumroad.com/l/xtqtpv" target="_blank" rel="noopener">Shop</a></li>
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
