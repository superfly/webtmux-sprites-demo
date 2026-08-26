// Sidebar component with minimap
import { LitElement, html, css } from 'lit';

class WebtmuxSidebar extends LitElement {
  static properties = {
    layout: { type: Object },
    activePane: { type: String },
    activeWindow: { type: String },
    collapsed: { type: Boolean },
    tmuxOpen: { type: Boolean },
    activeTutorial: { type: String },
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

    .tutorials {
      margin-bottom: 16px;
    }

    .tutorials-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
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

    .tutorials-header h2 {
      color: #e0c9ff;
      font-size: 15px;
      margin: 0;
      font-weight: 600;
    }

    .tutorial {
      background: #12122a;
      border: 1px solid #2a2a4a;
      border-radius: 6px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .tutorial.open {
      border-color: #c084fc;
    }

    .tutorial-title {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
      background: #1a1a35;
    }

    .tutorial-title:hover {
      background: #22224a;
    }

    .tutorial-title h3 {
      color: #e0c9ff;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      flex: 1;
      text-transform: none;
      letter-spacing: 0;
    }

    .tutorial-icon {
      font-size: 14px;
      flex-shrink: 0;
    }

    .tutorial-chevron {
      color: #888;
      font-size: 10px;
      transition: transform 0.2s;
      flex-shrink: 0;
    }

    .tutorial.open .tutorial-chevron {
      transform: rotate(90deg);
    }

    .tutorial-body {
      display: none;
      padding: 10px 12px 12px 12px;
    }

    .tutorial.open .tutorial-body {
      display: block;
    }

    .tutorial-body p.intro {
      color: #b4a7d6;
      font-size: 12px;
      line-height: 1.4;
      margin: 0 0 10px 0;
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

    .github-wrap {
      position: relative;
      margin: 12px 0 4px 0;
    }

    .github-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #24292f;
      color: #fff;
      border: 1px solid #444c56;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 12px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }

    .github-btn:hover {
      background: #32383f;
    }

    .github-btn svg {
      width: 16px;
      height: 16px;
    }

    .github-tooltip {
      position: absolute;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
      background: #0f0f1e;
      color: #e0c9ff;
      border: 1px solid #c084fc;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 11px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 20;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .github-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: #c084fc;
    }

    .github-wrap:hover .github-tooltip,
    .github-tooltip.show {
      opacity: 1;
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
    this.activeTutorial = 'getting-started';
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

  setTutorial(id) {
    if (this.activeTutorial === id) {
      this.activeTutorial = '';
    } else {
      this.activeTutorial = id;
      this.step = 1;
    }
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
    const tutorials = [
      {
        id: 'getting-started',
        icon: '🚀',
        title: 'Getting started',
        intro: 'Spin up a persistent cloud VM and serve HTTP from it.',
        steps: [
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
        ],
      },
      {
        id: 'services',
        icon: '♾️',
        title: 'Run a server forever',
        intro: html`
          Processes you start by hand die on a cold wake. A
          <a href="https://docs.sprites.dev/concepts/services/" target="_blank" rel="noopener">service</a>
          is owned by the Sprite runtime: it restarts on crash, comes back on boot, and can auto-start on incoming HTTP.
        `,
        steps: [
          {
            title: 'Register your server as a service',
            body: html`
              <p>From inside the Sprite, define a Python server that owns the Sprite's HTTP URL:</p>
              ${this.renderCmd('sprite-env services create web --cmd python3 --args "-m,http.server,8080" --http-port 8080')}
              <p><code>--http-port</code> routes the Sprite's URL to port 8080 and wakes the service on request.</p>
            `,
          },
          {
            title: 'Verify it\u2019s running',
            body: html`
              <p>List services and their status:</p>
              ${this.renderCmd('sprite-env services list')}
              <p>Or inspect one:</p>
              ${this.renderCmd('sprite-env services get web')}
            `,
          },
          {
            title: 'Tail the logs',
            body: html`
              <p>All stdout/stderr lands in a single log file per service:</p>
              ${this.renderCmd('tail -f /.sprite/logs/services/web.log')}
            `,
          },
          {
            title: 'Restart, stop, delete',
            body: html`
              <p>Everyday management:</p>
              ${this.renderCmd('sprite-env services restart web')}
              ${this.renderCmd('sprite-env services stop web')}
              ${this.renderCmd('sprite-env services delete web')}
              <p><code>stop</code> is sticky — the runtime won\u2019t auto-restart a service you stopped.</p>
            `,
          },
        ],
      },
      {
        id: 'checkpoints',
        icon: '⏪',
        title: 'Time travel with checkpoints',
        intro: html`
          A
          <a href="https://docs.sprites.dev/concepts/checkpoints/" target="_blank" rel="noopener">checkpoint</a>
          is a filesystem snapshot you take on purpose. Do something risky, roll back if it breaks.
        `,
        steps: [
          {
            title: 'Take a snapshot',
            body: html`
              <p>Before a risky change, save the current state with a comment:</p>
              ${this.renderCmd('sprite-env checkpoints create --comment "clean setup"')}
              <p>You'll get back a sequential ID like <code>v1</code>.</p>
            `,
          },
          {
            title: 'Break something (on purpose)',
            body: html`
              <p>Try an experiment — install packages, delete files, whatever:</p>
              ${this.renderCmd('rm -rf node_modules && npm install some-broken-thing')}
            `,
          },
          {
            title: 'Roll back',
            body: html`
              <p>Restore replaces the filesystem overlay and restarts the environment:</p>
              ${this.renderCmd('sprite-env checkpoints restore v1')}
              <p><strong>Destructive:</strong> anything not in the checkpoint is gone. Take a fresh checkpoint first if unsure.</p>
            `,
          },
          {
            title: 'Peek without restoring',
            body: html`
              <p>The last five checkpoints are mounted read-only — diff them against the current state:</p>
              ${this.renderCmd('diff /.sprite/checkpoints/v1/etc/hosts /etc/hosts')}
            `,
          },
        ],
      },
    ];

    return html`
      <div class="tutorials">
        <div class="tutorials-header">
          <span class="tutorial-badge">TUTORIALS</span>
          <h2>Try Fly.io Sprites</h2>
        </div>

        ${tutorials.map(t => {
          const tOpen = this.activeTutorial === t.id;
          return html`
            <div class="tutorial ${tOpen ? 'open' : ''}">
              <div class="tutorial-title" @click=${() => this.setTutorial(t.id)}>
                <span class="tutorial-icon">${t.icon}</span>
                <h3>${t.title}</h3>
                <span class="tutorial-chevron">▶</span>
              </div>
              <div class="tutorial-body">
                <p class="intro">${t.intro}</p>
                ${t.steps.map((s, i) => {
                  const n = i + 1;
                  const sOpen = tOpen && this.step === n;
                  return html`
                    <div class="step ${sOpen ? 'open' : ''}">
                      <div class="step-header" @click=${() => this.setStep(n)}>
                        <div class="step-num">${n}</div>
                        <div class="step-title">${s.title}</div>
                        <span class="step-chevron">▶</span>
                      </div>
                      <div class="step-body">${s.body}</div>
                    </div>
                  `;
                })}
              </div>
            </div>
          `;
        })}

        <div class="github-wrap">
          <button class="github-btn" @click=${this.connectGithub}>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Connect with GitHub
          </button>
          <div class="github-tooltip" id="gh-tooltip">
            Run this command to authenticate with GitHub!
          </div>
        </div>

        <a class="docs-link" href="https://docs.sprites.dev" target="_blank" rel="noopener">
          Read the full docs →
        </a>
      </div>
    `;
  }

  connectGithub() {
    const cmd = 'gh auth login --web --skip-ssh-key -p ssh';
    window.webtmux?.pasteToTerminal(cmd);

    // Force-show the tooltip for a few seconds after clicking, in case the
    // user's focus has moved away from the button.
    const tip = this.renderRoot?.querySelector('#gh-tooltip');
    if (tip) {
      tip.classList.add('show');
      clearTimeout(this._ghTipTimer);
      this._ghTipTimer = setTimeout(() => tip.classList.remove('show'), 3500);
    }
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
