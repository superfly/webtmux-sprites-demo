// Top-of-terminal banner explaining what this web terminal is and nudging
// users toward creating their own Sprite (regular mode) or hosting on port
// 8080 (trial mode). Dismissible; choice persisted in localStorage.
import { LitElement, html, css } from 'lit';

const STORAGE_KEY = 'webtmux:terminalBannerDismissed';
const POLL_INTERVAL_MS = 3000;

class WebtmuxTerminalBanner extends LitElement {
  static properties = {
    visible: { type: Boolean, reflect: true },
    appAvailable: { type: Boolean },
    justCameOnline: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    :host(:not([visible])) {
      display: none;
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(90deg, rgba(192, 132, 252, 0.18), rgba(192, 132, 252, 0.06));
      border-bottom: 1px solid #c084fc;
      color: #e0c9ff;
      padding: 8px 14px;
      font-size: 12px;
      line-height: 1.4;
    }

    .icon {
      flex-shrink: 0;
      font-size: 14px;
    }

    .msg {
      flex: 1;
    }

    .msg code {
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      color: #a6e3a1;
      padding: 1px 6px;
      border-radius: 3px;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      cursor: pointer;
    }

    .msg code:hover {
      border-color: #c084fc;
    }

    .msg a {
      color: #c084fc;
      text-decoration: underline;
    }

    .msg a:hover {
      color: #d5a3ff;
    }

    /* --- Open my app button --- */
    .open-app-wrap {
      position: relative;
      flex-shrink: 0;
      display: inline-flex;
    }

    .open-app-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #a6e3a1, #74c69d);
      color: #17141f;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      text-decoration: none;
      cursor: pointer;
      transition: filter 0.15s, opacity 0.3s, transform 0.2s;
      white-space: nowrap;
    }

    .open-app-btn:hover {
      filter: brightness(1.08);
    }

    .open-app-btn svg {
      width: 12px;
      height: 12px;
    }

    .open-app-btn[aria-disabled="true"] {
      background: #2a2a4a;
      color: #6c6890;
      cursor: not-allowed;
      pointer-events: none;
    }

    .open-app-btn[aria-disabled="true"] .dot {
      background: #6c6890;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #17141f;
      display: inline-block;
    }

    .open-app-btn:not([aria-disabled="true"]) .dot {
      animation: livePulse 1.8s ease-in-out infinite;
    }

    @keyframes livePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .open-app-btn.just-online {
      animation: appReady 1.6s ease-out 2;
    }

    @keyframes appReady {
      0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(166, 227, 161, 0.85); }
      30%  { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(166, 227, 161, 0.35); }
      100% { transform: scale(1);    box-shadow: 0 0 0 16px rgba(166, 227, 161, 0);   }
    }

    .tooltip {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: #0f0f1e;
      color: #e0c9ff;
      border: 1px solid #c084fc;
      border-radius: 5px;
      padding: 6px 10px;
      font-size: 11px;
      line-height: 1.4;
      white-space: normal;
      width: 220px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 20;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }

    .tooltip::after {
      content: '';
      position: absolute;
      bottom: 100%;
      right: 16px;
      border: 5px solid transparent;
      border-bottom-color: #c084fc;
    }

    .open-app-wrap:hover .tooltip {
      opacity: 1;
    }

    .close {
      flex-shrink: 0;
      background: transparent;
      border: none;
      color: #b4a7d6;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
    }

    .close:hover {
      color: #fff;
    }
  `;

  constructor() {
    super();
    // In trial mode the banner hosts the "Open my app" button, so it stays
    // visible always. In regular mode it's a plain nudge and can be dismissed.
    if (this.isTrial()) {
      this.clearDismissed();
      this.visible = true;
    } else {
      this.visible = !this.isDismissed();
    }
    this.appAvailable = false;
    this.justCameOnline = false;
    this._pollTimer = null;
    this._justOnlineTimer = null;
  }

  isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  clearDismissed() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  connectedCallback() {
    super.connectedCallback();
    this.refitTerminal();
    if (this.isTrial()) this.startPolling();
  }

  disconnectedCallback() {
    this.stopPolling();
    super.disconnectedCallback();
  }

  isTrial() {
    return !!window.WEBTMUX_TRIAL;
  }

  updated(changed) {
    if (changed.has('visible')) {
      this.refitTerminal();
    }
  }

  refitTerminal() {
    requestAnimationFrame(() => {
      const wt = window.webtmux;
      if (wt?.fitAddon) {
        try {
          wt.fitAddon.fit();
          wt.sendResize?.();
        } catch (e) {}
      }
    });
  }

  dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    this.visible = false;
    this.stopPolling();
  }

  copyCreateCmd(e) {
    const cmd = 'sprite create';
    navigator.clipboard.writeText(cmd).catch(() => {});
    const el = e.currentTarget;
    const original = el.textContent;
    el.textContent = 'copied!';
    setTimeout(() => { el.textContent = original; }, 1200);
  }

  // --- App availability polling (trial mode only) ---

  startPolling() {
    this.checkAppAvailable();
    this._pollTimer = setInterval(() => this.checkAppAvailable(), POLL_INTERVAL_MS);
  }

  stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    if (this._justOnlineTimer) {
      clearTimeout(this._justOnlineTimer);
      this._justOnlineTimer = null;
    }
  }

  async checkAppAvailable() {
    let available = false;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2000);
      const resp = await fetch('/', {
        method: 'HEAD',
        cache: 'no-store',
        signal: ctrl.signal,
        credentials: 'same-origin',
      });
      clearTimeout(t);
      // The trial proxy sets this header on its synthetic "app not running"
      // page. Anything else means the proxy reached the user's app.
      const isSetupPage = resp.headers.get('X-Webtmux-Trial-Setup') === '1';
      available = !isSetupPage;
    } catch (e) {
      available = false;
    }

    const wasAvailable = this.appAvailable;
    this.appAvailable = available;

    if (!wasAvailable && available) {
      this.justCameOnline = true;
      if (this._justOnlineTimer) clearTimeout(this._justOnlineTimer);
      this._justOnlineTimer = setTimeout(() => {
        this.justCameOnline = false;
      }, 3400);
    }
  }

  render() {
    if (!this.visible) return html``;
    const trial = this.isTrial();
    const port = window.WEBTMUX_TRIAL_APP_PORT || 8080;

    const openAppButton = trial ? html`
      <span class="open-app-wrap">
        ${this.appAvailable
          ? html`
              <a
                class="open-app-btn ${this.justCameOnline ? 'just-online' : ''}"
                href="/"
                target="_blank"
                rel="noopener"
                title="Open your app in a new tab"
              >
                <span class="dot"></span>
                Open my app ↗
              </a>
            `
          : html`
              <button class="open-app-btn" aria-disabled="true">
                <span class="dot"></span>
                Open my app
              </button>
              <span class="tooltip">
                Nothing is listening on port ${port} yet.
                Follow the sidebar guide to host something first — this button lights up
                as soon as your app is reachable.
              </span>
            `}
      </span>
    ` : '';

    return html`
      <div class="bar" role="status">
        <span class="icon">💡</span>
        <span class="msg">
          ${trial
            ? html`
                You're in a <strong>trial Sprite</strong>. Whatever you serve on port
                <code>${port}</code> shows up
                <a href="/" target="_blank" rel="noopener">at the root of this URL</a>
                — the web terminal itself lives at <code>/terminal</code>.
              `
            : html`
                <strong>Web Terminal</strong> is itself a Sprite that hosts a terminal so you can try
                things without leaving the browser. To host your own project, create a fresh Sprite
                with <code @click=${this.copyCreateCmd} title="Click to copy">sprite create</code>.
              `}
        </span>
        ${openAppButton}
        ${trial ? '' : html`<button class="close" @click=${this.dismiss} aria-label="Dismiss">×</button>`}
      </div>
    `;
  }
}

customElements.define('webtmux-terminal-banner', WebtmuxTerminalBanner);
