// Welcome modal: offers three ways to get started with Sprites.
import { LitElement, html, css } from 'lit';

const STORAGE_KEY = 'webtmux:agentsModalDismissed';

// Pre-installed agents shipped with every Sprite. Users can also install more.
const AGENTS = [
  { name: 'Antigravity', cmd: 'antigravity' },
  { name: 'Claude',      cmd: 'claude' },
  { name: 'Codex',       cmd: 'codex' },
  { name: 'Copilot',     cmd: 'copilot' },
  { name: 'Cursor',      cmd: 'cursor-agent' },
  { name: 'Gemini',      cmd: 'gemini' },
  { name: 'Grok',        cmd: 'grok' },
  { name: 'Muse',        cmd: 'muse' },
  { name: 'Pi',          cmd: 'pi' },
];

class WebtmuxAgentsModal extends LitElement {
  static properties = {
    visible: { type: Boolean },
    dontShow: { type: Boolean },
  };

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: none;
      font-family: system-ui, -apple-system, sans-serif;
      color: #e0c9ff;
    }

    :host([visible]) {
      display: block;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(10, 10, 20, 0.75);
      backdrop-filter: blur(4px);
    }

    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #12122a;
      border: 1px solid #c084fc;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      max-width: 580px;
      width: calc(100% - 32px);
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      padding: 24px;
      box-sizing: border-box;
    }

    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      color: #b4a7d6;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
      padding: 4px 8px;
    }

    .close:hover {
      color: #fff;
    }

    .badge {
      display: inline-block;
      background: #c084fc;
      color: #17141f;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    h1 {
      font-size: 20px;
      margin: 0 0 6px 0;
      color: #e0c9ff;
      font-weight: 600;
    }

    p.lead {
      color: #b4a7d6;
      font-size: 13px;
      line-height: 1.5;
      margin: 0 0 18px 0;
    }

    .path {
      background: #1a1a35;
      border: 1px solid #2a2a4a;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 10px;
    }

    .path.primary {
      background: linear-gradient(135deg, rgba(192, 132, 252, 0.18), rgba(192, 132, 252, 0.06));
      border-color: #c084fc;
      box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.12);
    }

    .path-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .path-num {
      background: #2a2a4a;
      color: #b4a7d6;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .path.primary .path-num {
      background: #c084fc;
      color: #17141f;
    }

    .path h2 {
      font-size: 14px;
      margin: 0;
      color: #e0c9ff;
      font-weight: 600;
      flex: 1;
    }

    .path p {
      font-size: 12px;
      color: #b4a7d6;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }

    .path-cta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid #c084fc;
      color: #c084fc;
      border-radius: 5px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s;
      font-family: inherit;
    }

    .path-cta:hover {
      background: #c084fc;
      color: #17141f;
    }

    .path.primary .path-cta {
      background: #c084fc;
      color: #17141f;
    }

    .path.primary .path-cta:hover {
      background: #d5a3ff;
    }

    .agents {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 8px;
    }

    @media (max-width: 480px) {
      .agents { grid-template-columns: 1fr; }
    }

    .agent {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      border-radius: 5px;
      padding: 5px 8px;
      font-size: 12px;
    }

    .agent .name {
      color: #e0c9ff;
      font-weight: 500;
    }

    .agent code {
      background: #16162e;
      border: 1px solid #2a2a4a;
      color: #a6e3a1;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .agent code:hover {
      border-color: #c084fc;
    }

    .agent code.copied {
      border-color: #a6e3a1;
      color: #a6e3a1;
    }

    .hint {
      font-size: 11px;
      color: #7a7092;
      margin: 6px 0 0 0;
    }

    .hint a, .path p a {
      color: #c084fc;
      text-decoration: underline;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .dont-show {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #b4a7d6;
      cursor: pointer;
      user-select: none;
    }

    .dont-show input {
      accent-color: #c084fc;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.dontShow = false;
    this.visible = !this.isDismissed();
  }

  isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  updated(changed) {
    if (changed.has('visible')) {
      if (this.visible) this.setAttribute('visible', '');
      else this.removeAttribute('visible');
    }
  }

  dismiss() {
    if (this.dontShow) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    }
    this.visible = false;
  }

  onOverlayClick(e) {
    if (e.target === e.currentTarget) this.dismiss();
  }

  onCommandClick(e, cmd) {
    const el = e.currentTarget;
    navigator.clipboard.writeText(cmd).then(() => {
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1200);
    }).catch(() => {});
  }

  render() {
    if (!this.visible) return html``;
    return html`
      <div class="overlay" @click=${this.onOverlayClick}>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="agents-modal-title">
          <button class="close" @click=${this.dismiss} aria-label="Close">×</button>
          <span class="badge">WELCOME</span>
          <h1 id="agents-modal-title">Three ways to try Sprites</h1>
          <p class="lead">
            Pick whichever fits you. All three end with something running in a persistent
            cloud VM you fully control.
          </p>

          <div class="path primary">
            <div class="path-header">
              <span class="path-num">1</span>
              <h2>Follow the guide in the sidebar</h2>
            </div>
            <p>
              Step-by-step: log in, create a Sprite, serve HTTP, run background services,
              and time-travel with checkpoints.
            </p>
            <button class="path-cta" @click=${this.dismiss}>
              Show me the guide →
            </button>
          </div>

          <div class="path">
            <div class="path-header">
              <span class="path-num">2</span>
              <h2>Host something with your favorite agent</h2>
            </div>
            <p>
              Every Sprite ships with these AI coding agents pre-installed. Launch one and
              ask it to build and serve something for you.
            </p>
            <div class="agents">
              ${AGENTS.map(a => html`
                <div class="agent">
                  <span class="name">${a.name}</span>
                  <code
                    title="Click to copy"
                    @click=${(e) => this.onCommandClick(e, a.cmd)}
                  >${a.cmd}</code>
                </div>
              `)}
            </div>
            <p class="hint">Click any command to copy it. You can install other agents inside your Sprite too.</p>
          </div>

          <div class="path">
            <div class="path-header">
              <span class="path-num">3</span>
              <h2>Use Sprites from an agent on your machine</h2>
            </div>
            <p>
              Already using Claude Code, Cursor, or another agent locally? Drop in our
              <a href="https://github.com/superfly/skills" target="_blank" rel="noopener">Sprites skill</a>
              and it can create and manage Sprites for you from anywhere.
            </p>
            <a
              class="path-cta"
              href="https://github.com/superfly/skills"
              target="_blank"
              rel="noopener"
            >
              Get the skill →
            </a>
          </div>

          <div class="footer">
            <label class="dont-show">
              <input
                type="checkbox"
                .checked=${this.dontShow}
                @change=${(e) => (this.dontShow = e.target.checked)}
              />
              Don't show this again
            </label>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('webtmux-agents-modal', WebtmuxAgentsModal);
