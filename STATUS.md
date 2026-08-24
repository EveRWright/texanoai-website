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

**Continuous deploy:** link `EveRWright/texanoai-website` in Netlify UI → Project configuration → Build & deploy → Continuous deployment → Link repository.

Deep link: https://app.netlify.com/projects/texanoai-website-preview/configuration/deploys

## Not wired yet
- Continuous deploy (GitHub link in Netlify UI — pending Michael)
- Domain cutover
- Citation lock on economics literature figures

## Wire check
- Triggered continuous-deploy probe from Eve after Michael reported GitHub link (2026-08-24).
