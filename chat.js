
/* ============================================================
   Delight & Savor — Floating Chat Agent
   Drop this file in your repo root and add to every page:
   <script src="/chat.js"></script>  (before </body>)
   Requires your Netlify proxy at /.netlify/functions/anthropic
   ============================================================ */

(function () {
  // The system prompt lives server-side in netlify/functions/anthropic.js
  // so it cannot be replaced by a caller.

  // ── STYLES ────────────────────────────────────────────────
  const css = `
    #ds-chat-bubble {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    #ds-chat-toggle {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #2C3650;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(44,54,80,0.35);
      transition: background 0.2s, transform 0.2s;
      margin-left: auto;
    }
    #ds-chat-toggle:hover { background: #C29B61; transform: scale(1.05); }
    #ds-chat-toggle svg { width: 24px; height: 24px; fill: #FAF7F2; }
    #ds-chat-toggle .ds-close-icon { display: none; }
    #ds-chat-bubble.open #ds-chat-toggle .ds-open-icon { display: none; }
    #ds-chat-bubble.open #ds-chat-toggle .ds-close-icon { display: block; }

    #ds-chat-window {
      display: none;
      flex-direction: column;
      width: 340px;
      max-width: calc(100vw - 2rem);
      height: 480px;
      max-height: calc(100vh - 120px);
      background: #FAF7F2;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(44,54,80,0.25);
      overflow: hidden;
      margin-bottom: 0.75rem;
      border: 1px solid #ddd8ce;
    }
    #ds-chat-bubble.open #ds-chat-window { display: flex; }

    #ds-chat-header {
      background: #2C3650;
      color: #FAF7F2;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    #ds-chat-header .ds-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(194,155,97,0.25);
      border: 1px solid rgba(194,155,97,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }
    #ds-chat-header .ds-header-text .ds-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 0.95rem;
      font-weight: 400;
    }
    #ds-chat-header .ds-header-text .ds-status {
      font-size: 0.7rem;
      color: rgba(237,217,176,0.8);
      letter-spacing: 0.05em;
    }

    #ds-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      scroll-behavior: smooth;
    }
    #ds-messages::-webkit-scrollbar { width: 4px; }
    #ds-messages::-webkit-scrollbar-thumb { background: #ddd8ce; border-radius: 2px; }

    .ds-msg {
      max-width: 85%;
      font-size: 0.88rem;
      line-height: 1.55;
      padding: 0.6rem 0.85rem;
      border-radius: 10px;
      animation: ds-fadein 0.2s ease;
    }
    @keyframes ds-fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    .ds-msg.agent {
      background: #fff;
      color: #2a2a2a;
      align-self: flex-start;
      border: 1px solid #ddd8ce;
      border-bottom-left-radius: 3px;
    }
    .ds-msg.user {
      background: #2C3650;
      color: #FAF7F2;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }
    .ds-msg.typing {
      background: #fff;
      border: 1px solid #ddd8ce;
      align-self: flex-start;
      color: #aaa;
      font-style: italic;
      font-size: 0.8rem;
    }
    .ds-typing-dots span {
      display: inline-block;
      width: 5px; height: 5px;
      background: #C29B61;
      border-radius: 50%;
      margin: 0 1px;
      animation: ds-bounce 1.2s infinite;
    }
    .ds-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .ds-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ds-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }

    #ds-chat-form {
      padding: 0.75rem 1rem;
      border-top: 1px solid #ddd8ce;
      display: flex;
      gap: 0.5rem;
      background: #fff;
      flex-shrink: 0;
    }
    #ds-chat-input {
      flex: 1;
      border: 1px solid #ddd8ce;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 0.88rem;
      color: #2a2a2a;
      background: #FAF7F2;
      resize: none;
      outline: none;
      line-height: 1.4;
      min-height: 38px;
      max-height: 80px;
    }
    #ds-chat-input:focus { border-color: #7A8C72; }
    #ds-chat-send {
      background: #2C3650;
      color: #FAF7F2;
      border: none;
      border-radius: 6px;
      padding: 0 0.9rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
      flex-shrink: 0;
      align-self: flex-end;
      height: 38px;
    }
    #ds-chat-send:hover { background: #C29B61; }
    #ds-chat-send:disabled { opacity: 0.45; cursor: not-allowed; }

    #ds-chat-label {
      text-align: center;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      color: rgba(44,54,80,0.9);
      background: #FAF7F2;
      padding: 0.2rem 0.75rem 0.5rem;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    @media (max-width: 400px) {
      #ds-chat-window { width: calc(100vw - 1.5rem); }
      #ds-chat-bubble { right: 0.75rem; bottom: 0.75rem; }
    }
  `;

  // ── DOM ───────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const wrap = document.createElement('div');
  wrap.id = 'ds-chat-bubble';
  wrap.innerHTML = `
    <div id="ds-chat-window">
      <div id="ds-chat-header">
        <div class="ds-avatar">❧</div>
        <div class="ds-header-text">
          <div class="ds-name">Have a Question?</div>
          <div class="ds-status">Delight &amp; Savor · Ask anything</div>
        </div>
      </div>
      <div id="ds-messages"></div>
      <div id="ds-chat-label">Powered by AI &middot; <a href="/faq#contact" style="color:#7A8C72;text-decoration:none;">Contact Kim directly</a></div>
      <form id="ds-chat-form" autocomplete="off">
        <textarea id="ds-chat-input" placeholder="Ask about curriculum, ordering, the planner…" rows="1"></textarea>
        <button id="ds-chat-send" type="submit">&#8594;</button>
      </form>
    </div>
    <button id="ds-chat-toggle" aria-label="Open chat">
      <svg class="ds-open-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
      <svg class="ds-close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="#FAF7F2" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </svg>
    </button>
  `;
  document.body.appendChild(wrap);

  // ── STATE ─────────────────────────────────────────────────
  const messages = [];
  const messagesEl = document.getElementById('ds-messages');
  const input = document.getElementById('ds-chat-input');
  const form = document.getElementById('ds-chat-form');
  const sendBtn = document.getElementById('ds-chat-send');
  const toggle = document.getElementById('ds-chat-toggle');
  let opened = false;

  // ── GREETING ──────────────────────────────────────────────
  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `ds-msg ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ds-msg typing';
    div.innerHTML = '<span class="ds-typing-dots"><span></span><span></span><span></span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  toggle.addEventListener('click', () => {
    wrap.classList.toggle('open');
    if (!opened) {
      opened = true;
      setTimeout(() => {
        addMessage('agent', 'Hi! I can answer questions about the curriculum, the Tend planner, ordering, or Kim\'s approach. What would you like to know?');
      }, 200);
    }
    if (wrap.classList.contains('open')) input.focus();
  });

  // ── AUTO-RESIZE TEXTAREA ──────────────────────────────────
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  // ── SEND ──────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    addMessage('user', text);
    messages.push({ role: 'user', content: text });

    const typingEl = showTyping();

    try {
      const res = await fetch('/.netlify/functions/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only the transcript is sent; model, token cap and system prompt
        // are pinned server-side in netlify/functions/anthropic.js.
        body: JSON.stringify({ messages: messages.slice(-24) }),
      });

      const data = await res.json().catch(() => ({}));
      const reply = (res.ok && data.reply)
        ? data.reply
        : 'Sorry, something went wrong. Please try again or contact Kim directly.';

      typingEl.remove();
      addMessage('agent', reply);
      if (res.ok && data.reply) messages.push({ role: 'assistant', content: reply });

    } catch (err) {
      typingEl.remove();
      addMessage('agent', 'Something went wrong on my end. You can reach Kim directly through the contact page.');
    }

    sendBtn.disabled = false;
    input.focus();
  });

})();
