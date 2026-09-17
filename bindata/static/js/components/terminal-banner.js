// Top-of-terminal banner explaining what this web terminal is and nudging
// users toward creating their own Sprite. Dismissible; choice persisted in
// localStorage.
import { LitElement, html, css } from 'lit';

const STORAGE_KEY = 'webtmux:terminalBannerDismissed';

class WebtmuxTerminalBanner extends LitElement {
  static properties = {
    visible: { type: Boolean, reflect: true },
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
    this.visible = !this.isDismissed();
  }

  isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Nudge xterm.js to refit now that this element occupies vertical space.
    this.refitTerminal();
  }

  updated(changed) {
    if (changed.has('visible')) {
      this.refitTerminal();
    }
  }

  refitTerminal() {
    // Called from lifecycle callbacks; defer to the next frame so the DOM
    // has already reflowed before we ask xterm.js for the new dimensions.
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
  }

  copyCreateCmd(e) {
    const cmd = 'sprite create';
    navigator.clipboard.writeText(cmd).catch(() => {});
    const el = e.currentTarget;
    const original = el.textContent;
    el.textContent = 'copied!';
    setTimeout(() => { el.textContent = original; }, 1200);
  }

  render() {
    if (!this.visible) return html``;
    const trial = !!window.WEBTMUX_TRIAL;
    return html`
      <div class="bar" role="status">
        <span class="icon">💡</span>
        <span class="msg">
          ${trial
            ? html`
                You're in a <strong>trial Sprite</strong>. Whatever you serve on port
                <code>${window.WEBTMUX_TRIAL_APP_PORT || 8080}</code> shows up
                <a href="/" target="_blank" rel="noopener">at the root of this URL</a>
                — the web terminal itself lives at <code>/terminal</code>.
              `
            : html`
                <strong>Web Terminal</strong> is itself a Sprite that hosts a terminal so you can try
                things without leaving the browser. To host your own project, create a fresh Sprite
                with <code @click=${this.copyCreateCmd} title="Click to copy">sprite create</code>.
              `}
        </span>
        <button class="close" @click=${this.dismiss} aria-label="Dismiss">×</button>
      </div>
    `;
  }
}

customElements.define('webtmux-terminal-banner', WebtmuxTerminalBanner);
