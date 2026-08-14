// Sidebar component with minimap
import { LitElement, html, css } from 'lit';

class WebtmuxSidebar extends LitElement {
  static properties = {
    layout: { type: Object },
    activePane: { type: String },
    activeWindow: { type: String },
    collapsed: { type: Boolean },
    tmuxOpen: { type: Boolean },
    step: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      width: 300px;
      background: #16213e;
      border-left: 1px solid #0f3460;
      padding: 12px;
      overflow-y: auto;
      transition: width 0.2s, padding 0.2s;
      color: #cdd6f4;
      font-family: system-ui, -apple-system, sans-serif;
    }

    :host(.collapsed) {
      width: 40px;
      padding: 8px;
      overflow: hidden;
    }

    .tutorial {
      margin-bottom: 16px;
    }

    .tutorial-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }

    .tutorial-badge {
      background: #c084fc;
      color: #17141f;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }

    .tutorial h2 {
      color: #e0c9ff;
      font-size: 15px;
      margin: 0;
      font-weight: 600;
    }

    .tutorial p.intro {
      color: #b4a7d6;
      font-size: 12px;
      line-height: 1.4;
      margin: 0 0 12px 0;
    }

    .step {
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-left: 3px solid #c084fc;
      border-radius: 4px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      cursor: pointer;
      user-select: none;
    }

    .step-header:hover {
      background: #22224a;
    }

    .step-num {
      background: #c084fc;
      color: #17141f;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-title {
      font-size: 12px;
      color: #e0c9ff;
      font-weight: 500;
      flex: 1;
    }

    .step-chevron {
      color: #888;
      font-size: 10px;
      transition: transform 0.2s;
    }

    .step.open .step-chevron {
      transform: rotate(90deg);
    }

    .step-body {
      display: none;
      padding: 0 10px 10px 10px;
      font-size: 12px;
      color: #b4a7d6;
      line-height: 1.5;
    }

    .step.open .step-body {
      display: block;
    }

    .step-body p {
      margin: 4px 0 8px 0;
    }

    .step-body code {
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 11px;
      color: #f5c2e7;
    }

    .step-body pre {
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: #a6e3a1;
      margin: 4px 0 8px 0;
      overflow-x: auto;
      font-family: ui-monospace, monospace;
    }

    .cmd {
      display: flex;
      align-items: stretch;
      gap: 4px;
      margin: 4px 0 8px 0;
    }

    .cmd pre {
      flex: 1;
      margin: 0;
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: #a6e3a1;
      overflow-x: auto;
      font-family: ui-monospace, monospace;
      white-space: pre;
    }

    .copy-btn {
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-radius: 4px;
      color: #b4a7d6;
      cursor: pointer;
      padding: 0 8px;
      font-size: 10px;
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      gap: 3px;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .copy-btn:hover {
      border-color: #c084fc;
      color: #e0c9ff;
    }

    .copy-btn.copied {
      border-color: #a6e3a1;
      color: #a6e3a1;
    }

    .copy-btn svg {
      width: 11px;
      height: 11px;
    }

    .step-body a {
      color: #c084fc;
      text-decoration: underline;
    }

    .docs-link {
      display: block;
      text-align: center;
      color: #c084fc;
      font-size: 11px;
      text-decoration: none;
      padding: 6px;
      margin-top: 4px;
    }

    .docs-link:hover {
      text-decoration: underline;
    }

    .tmux-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background: transparent;
      border: none;
      border-top: 1px solid #0f3460;
      color: #666;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 10px 0 8px 0;
      cursor: pointer;
    }

    .tmux-toggle:hover {
      color: #e94560;
    }

    .tmux-toggle-chevron {
      transition: transform 0.2s;
    }

    .tmux-toggle.open .tmux-toggle-chevron {
      transform: rotate(90deg);
    }

    .tmux-section {
      display: none;
    }

    .tmux-section.open {
      display: block;
    }

    .toggle-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #1a1a2e;
      border: 1px solid #0f3460;
      border-radius: 4px;
      color: #888;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .toggle-btn:hover {
      border-color: #e94560;
      color: #fff;
    }

    :host(.collapsed) .toggle-btn {
      position: static;
      margin: 0 auto;
    }

    :host(.collapsed) .sidebar-content {
      display: none;
    }

    .sidebar-content {
      position: relative;
    }

    h3 {
      color: #e94560;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
    }

    .window-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 16px;
    }

    .window-tab {
      background: #1a1a2e;
      color: #888;
      border: 1px solid #0f3460;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .window-tab:hover {
      border-color: #e94560;
      color: #fff;
    }

    .window-tab.active {
      background: #e94560;
      border-color: #e94560;
      color: #fff;
    }

    .minimap {
      position: relative;
      background: #1a1a2e;
      border: 1px solid #0f3460;
      border-radius: 4px;
      height: 150px;
      margin-bottom: 16px;
    }

    .pane {
      position: absolute;
      background: #0f3460;
      border: 1px solid #16213e;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #666;
    }

    .pane:hover {
      border-color: #e94560;
      background: #1a3a5c;
    }

    .pane.active {
      border-color: #e94560;
      background: #1a3a5c;
      box-shadow: 0 0 8px rgba(233, 69, 96, 0.3);
    }

    .pane.active::after {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 6px;
      height: 6px;
      background: #e94560;
      border-radius: 50%;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .action-btn {
      background: #1a1a2e;
      border: 1px solid #0f3460;
      border-radius: 4px;
      color: #888;
      padding: 8px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .action-btn:hover {
      border-color: #e94560;
      color: #fff;
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
    }

    .session-info {
      color: #666;
      font-size: 10px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #0f3460;
    }

    .session-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 16px;
    }

    .session-tab {
      background: #1a1a2e;
      color: #888;
      border: 1px solid #0f3460;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .session-tab:hover {
      border-color: #4a9eff;
      color: #fff;
    }

    .session-tab.active {
      background: #4a9eff;
      border-color: #4a9eff;
      color: #fff;
    }

    .session-tab .win-count {
      font-size: 9px;
      opacity: 0.7;
      margin-left: 4px;
    }
  `;

  constructor() {
    super();
    this.layout = null;
    this.activePane = '';
    this.activeWindow = '';
    this.collapsed = false;
    this.tmuxOpen = false;
    this.step = 1;

    // Listen for layout updates
    window.addEventListener('tmux-layout-update', (e) => {
      this.layout = e.detail;
      this.activePane = e.detail.activePaneId;
      this.activeWindow = e.detail.activeWindowId;
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('collapsed')) {
      if (this.collapsed) {
        this.classList.add('collapsed');
      } else {
        this.classList.remove('collapsed');
      }
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  toggleTmux() {
    this.tmuxOpen = !this.tmuxOpen;
  }

  setStep(n) {
    this.step = this.step === n ? 0 : n;
  }

  renderCmd(cmd) {
    return html`
      <div class="cmd">
        <pre>${cmd}</pre>
        <button
          class="copy-btn"
          @click=${(e) => this.copyCmd(e, cmd)}
          title="Copy to clipboard"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </button>
      </div>
    `;
  }

  copyCmd(e, cmd) {
    const btn = e.currentTarget;
    navigator.clipboard.writeText(cmd).then(() => {
      btn.classList.add('copied');
      const label = btn.querySelector('span');
      const prev = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        label.textContent = prev;
      }, 1500);
    });
  }

  renderTutorial() {
    const steps = [
      {
        title: 'Log in to Sprites',
        body: html`
          <p>Authenticate with your Fly.io account:</p>
          ${this.renderCmd('sprite login')}
          <p>A browser window will open to complete sign-in.</p>
        `,
      },
      {
        title: 'Create your first Sprite',
        body: html`
          <p>Spin up a persistent Linux env and drop into an SSH shell automatically:</p>
          ${this.renderCmd('sprite create my-sprite')}
          <p>You'll land inside the Sprite. Everything you install or write to disk sticks around between runs.</p>
        `,
      },
      {
        title: 'Grab your Sprite URL',
        body: html`
          <p>Every Sprite gets a public HTTP URL. Print it so you know where to point your browser next:</p>
          ${this.renderCmd('sprite-env info')}
          <p>Copy the URL from the output — you'll open it in step 4.</p>
        `,
      },
      {
        title: 'Start a Python HTTP server',
        body: html`
          <p>From inside the Sprite, serve the current directory on port <code>8080</code>:</p>
          ${this.renderCmd('python3 -m http.server 8080')}
          <p>The Sprite auto-routes HTTP traffic to this port. Open the URL from step 3 in your browser to see it.</p>
          <p>To make it publicly accessible without a token:</p>
          ${this.renderCmd('sprite config update --url-auth public')}
        `,
      },
    ];

    return html`
      <div class="tutorial">
        <div class="tutorial-header">
          <span class="tutorial-badge">TUTORIAL</span>
          <h2>Try Fly.io Sprites</h2>
        </div>
        <p class="intro">
          Follow along in the terminal to spin up a persistent cloud VM and serve HTTP from it.
        </p>
        ${steps.map((s, i) => {
          const n = i + 1;
          const open = this.step === n;
          return html`
            <div class="step ${open ? 'open' : ''}">
              <div class="step-header" @click=${() => this.setStep(n)}>
                <div class="step-num">${n}</div>
                <div class="step-title">${s.title}</div>
                <span class="step-chevron">▶</span>
              </div>
              <div class="step-body">${s.body}</div>
            </div>
          `;
        })}
        <a class="docs-link" href="https://docs.sprites.dev" target="_blank" rel="noopener">
          Read the full docs →
        </a>
      </div>
    `;
  }

  render() {
    const toggleIcon = this.collapsed
      ? html`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`
      : html`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;

    if (!this.layout) {
      return html`
        <button class="toggle-btn" @click=${this.toggleCollapsed}>${toggleIcon}</button>
        <div class="sidebar-content">
          ${this.renderTutorial()}
          <p style="color: #666; font-size: 12px;">Connecting to tmux…</p>
        </div>
      `;
    }

    const activeWindow = this.layout.windows?.find(w => w.id === this.activeWindow);

    const sessions = this.layout.sessions || [];
    const showSessions = sessions.length > 1;

    return html`
      <button class="toggle-btn" @click=${this.toggleCollapsed}>${toggleIcon}</button>
      <div class="sidebar-content">
      ${this.renderTutorial()}

      <button class="tmux-toggle ${this.tmuxOpen ? 'open' : ''}" @click=${this.toggleTmux}>
        <span>tmux controls</span>
        <span class="tmux-toggle-chevron">▶</span>
      </button>
      <div class="tmux-section ${this.tmuxOpen ? 'open' : ''}">
      ${showSessions ? html`
        <h3>Sessions</h3>
        <div class="session-tabs">
          ${sessions.map(sess => html`
            <button
              class="session-tab ${sess.active ? 'active' : ''}"
              @click=${() => this.switchSession(sess.name)}
            >
              ${sess.name}<span class="win-count">(${sess.windows})</span>
            </button>
          `)}
        </div>
      ` : ''}

      <h3>Windows</h3>
      <div class="window-tabs">
        ${this.layout.windows?.map(win => html`
          <button
            class="window-tab ${win.id === this.activeWindow ? 'active' : ''}"
            @click=${() => this.selectWindow(win.id)}
          >
            ${win.index}: ${win.name || 'bash'}
          </button>
        `)}
        <button class="window-tab" @click=${() => this.newWindow()}>+</button>
      </div>

      <h3>Panes</h3>
      <div class="minimap">
        ${activeWindow?.panes?.map(pane => {
          // Calculate percentage positions
          const totalWidth = activeWindow.panes.reduce((max, p) => Math.max(max, p.left + p.width), 0);
          const totalHeight = activeWindow.panes.reduce((max, p) => Math.max(max, p.top + p.height), 0);

          const left = (pane.left / totalWidth) * 100;
          const top = (pane.top / totalHeight) * 100;
          const width = (pane.width / totalWidth) * 100;
          const height = (pane.height / totalHeight) * 100;

          return html`
            <div
              class="pane ${pane.id === this.activePane ? 'active' : ''}"
              style="left: ${left}%; top: ${top}%; width: ${width}%; height: ${height}%"
              @click=${() => this.selectPane(pane.id)}
              title="${pane.command}"
            >
              ${pane.index}
            </div>
          `;
        })}
      </div>

      <h3>Actions</h3>
      <div class="actions">
        <button class="action-btn" @click=${() => this.splitPane(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
          Split H
        </button>
        <button class="action-btn" @click=${() => this.splitPane(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
          </svg>
          Split V
        </button>
        <button class="action-btn" @click=${() => this.newWindow()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          New Win
        </button>
        <button class="action-btn" @click=${() => this.closePane()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Close
        </button>
      </div>

      <div class="session-info">
        Session: ${this.layout.sessionName}<br>
        ${this.layout.windows?.length || 0} windows, ${activeWindow?.panes?.length || 0} panes
      </div>
      </div>
      </div>
    `;
  }

  selectPane(paneId) {
    window.webtmux?.selectPane(paneId);
  }

  selectWindow(windowId) {
    window.webtmux?.selectWindow(windowId);
  }

  switchSession(sessionName) {
    window.webtmux?.switchSession(sessionName);
  }

  splitPane(horizontal) {
    window.webtmux?.splitPane(horizontal);
  }

  newWindow() {
    window.webtmux?.newWindow();
  }

  closePane() {
    window.webtmux?.closePane(this.activePane);
  }
}

customElements.define('webtmux-sidebar', WebtmuxSidebar);
