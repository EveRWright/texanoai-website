# Wiring status — 2026-08-24

## Confirmed

### GitHub
- Authenticated as **EveRWright** (MCP + `gh` CLI after device login)
- Build repo: **EveRWright/texanoai-website** (private)
- Other Eve repo: **EveRWright/justice-pulse** (separate)

### Netlify
- Authenticated as **tio@texanoai.com** · Owner on team **TexanoAI** (`tio-sof1vug`)
- Production: **texanoai-mmx** → https://www.texanoai.com (manual deploy 2025-11-11) — **leave alone until go**

## First site build (this repo)
- `index.html` — Order + Q/Q homepage from Hub mockup
- `assets/site.css` — Order visual system
- `assets/logo-wings.jpg` — winged wordmark (+ `.b64` sidecar)
- `assets/favicon.svg` / `favicon-32.png` / `logo-primary.svg`
- `netlify.toml` — static publish + security headers


## Preview staging (live 2026-08-24)

| | |
|--|--|
| URL | https://texanoai-website-preview.netlify.app |
| Project | `texanoai-website-preview` |
| Site id | `179cf08c-59fc-48c0-b5f5-91fa8ba3efca` |
| First deploy | `6a8cd2a50c7d4a75824f8dd3` (ready) |
| Production | **untouched** — `texanoai-mmx` / www.texanoai.com |

**Continuous deploy:** CONFIRMED 2026-08-24 — GitHub `EveRWright/texanoai-website` @ `main` → this Netlify project.
- Proof deploy: `6a8cd6733822c6b27b498fc0` · commit `a6646a1` · `manual_deploy: false` · branch alias `main--texanoai-website-preview.netlify.app`

## Not wired yet
- Domain cutover to www.texanoai.com
- Citation lock on economics literature figures

## First-pass UX (2026-08-24)
Shipped from Claude feedback: mobile hamburger nav, Privacy/Terms stubs, og/Twitter/canonical/JSON-LD, robots+sitemap, custom 404, focus styles, muted contrast bump, logo `.b64` path removed, asset cache + Permissions-Policy + HSTS headers.
Still open: citation lock, Netlify Forms CTA, dedicated OG card art, CSP, www cutover URL swap in meta/sitemap.
