package server

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

// trialProxyHandler reverse-proxies any non-terminal path to the user's app
// on TrialAppPort. If the app isn't listening, it renders a friendly setup
// page that points them at the tutorial.
func (server *Server) trialProxyHandler(terminalPath string) http.Handler {
	targetURL, err := url.Parse(fmt.Sprintf("http://127.0.0.1:%d", server.options.TrialAppPort))
	if err != nil {
		log.Fatalf("trial proxy: invalid target url: %v", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Rewrite Host so servers doing name-based routing still work sanely,
	// and pass X-Forwarded-* headers.
	origDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		origDirector(req)
		req.Header.Set("X-Forwarded-Host", req.Host)
		if req.Header.Get("X-Forwarded-Proto") == "" {
			proto := "http"
			if req.TLS != nil {
				proto = "https"
			}
			req.Header.Set("X-Forwarded-Proto", proto)
		}
		req.Host = targetURL.Host
	}

	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("trial proxy: upstream not reachable at %s (%v)", targetURL.Host, err)
		server.serveTrialSetupPage(w, terminalPath)
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Defensive: never proxy /terminal/ requests, in case routing changed.
		if strings.HasPrefix(r.URL.Path, terminalPath) {
			http.NotFound(w, r)
			return
		}
		proxy.ServeHTTP(w, r)
	})
}

var trialSetupTemplate = template.Must(template.New("trial-setup").Parse(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your app isn't running yet</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #12122a;
      color: #e0c9ff;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      max-width: 640px;
      width: 100%;
      background: #1a1a35;
      border: 1px solid #c084fc;
      border-radius: 10px;
      padding: 28px 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      background: #c084fc;
      color: #17141f;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    h1 { font-size: 22px; margin: 0 0 8px 0; color: #e0c9ff; }
    p  { color: #b4a7d6; line-height: 1.55; font-size: 14px; margin: 0 0 14px 0; }
    ol { color: #b4a7d6; line-height: 1.7; font-size: 14px; padding-left: 20px; margin: 0 0 16px 0; }
    code, pre {
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      font-size: 13px;
      color: #a6e3a1;
    }
    pre {
      background: #0f0f1e;
      border: 1px solid #2a2a4a;
      border-radius: 6px;
      padding: 10px 12px;
      overflow-x: auto;
      margin: 6px 0 12px 0;
    }
    .cta {
      display: inline-block;
      background: #c084fc;
      color: #17141f;
      padding: 10px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .cta:hover { background: #d5a3ff; }
    a { color: #c084fc; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">SET UP</span>
    <h1>Nothing is running on port {{.Port}} yet</h1>
    <p>
      This is a <strong>trial Sprite</strong> — your app and the web terminal share the same URL.
      Requests to the root URL are proxied to whatever service is listening on port
      <code>{{.Port}}</code>. Nothing is listening yet.
    </p>
    <p>Quickest way to get something up:</p>
    <ol>
      <li>Open the <a href="{{.TerminalPath}}">web terminal</a>.</li>
      <li>Follow the <em>Run a server forever</em> tutorial in the sidebar.</li>
      <li>Register your app as a service, for example:
        <pre>sprite-env services create web \
  --cmd python3 \
  --args "-m,http.server,{{.Port}}"</pre>
      </li>
      <li>Reload this page — your app takes over.</li>
    </ol>
    <a class="cta" href="{{.TerminalPath}}">Open the web terminal →</a>
  </div>
</body>
</html>`))

func (server *Server) serveTrialSetupPage(w http.ResponseWriter, terminalPath string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// Signal to the terminal UI that this is our synthetic setup page and
	// not an actual response from the user's app.
	w.Header().Set("X-Webtmux-Trial-Setup", "1")
	w.WriteHeader(http.StatusServiceUnavailable)
	_ = trialSetupTemplate.Execute(w, map[string]interface{}{
		"Port":         server.options.TrialAppPort,
		"TerminalPath": terminalPath,
	})
}
