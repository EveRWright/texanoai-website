# TexanoAI Website

Private build repo for the TexanoAI corporate / product site.

**Live production** (`www.texanoai.com`) still serves the Nov 2025 manual Netlify deploy on `texanoai-mmx` until cutover. This repo is the Order + Q/Q rebuild.


## Preview (staging)

| | |
|--|--|
| **Preview URL** | https://texanoai-website-preview.netlify.app |
| Netlify project | `texanoai-website-preview` |
| Site id | `179cf08c-59fc-48c0-b5f5-91fa8ba3efca` |
| App | https://app.netlify.com/projects/texanoai-website-preview |

Production `www.texanoai.com` / `texanoai-mmx` is **not** this project.

After GitHub is linked under Continuous deployment, every push to `main` refreshes the preview URL.

## Local preview

```bash
cd /path/to/texanoai-website
python3 scripts/decode_assets.py   # optional: materialize logo JPEG from .b64
python3 -m http.server 5173
# open http://127.0.0.1:5173
```

## Structure

| Path | Role |
|------|------|
| `index.html` | Homepage (Order visual system + Q/Q economics altitude) |
| `assets/` | Wings wordmark (.b64 + optional JPEG), favicons, June primary SVG |
| `scripts/decode_assets.py` | Decode `*.b64` sidecars to binary |
| `netlify.toml` | Static publish + security headers |
| `STATUS.md` | Auth / Netlify / deploy wiring notes |

## Hub drafts

Source outlines + notes live in the Eve Sovereign Hub branch:

`~/Eve_Sovereign_Hub/Branches/TexanoAI_Website/`

Brand masters: `~/TEXANOAI/` (point; do not scatter).

## Deploy policy

1. Preview from this repo
2. Optional Netlify staging (no custom domain)
3. Production cutover of `texanoai-mmx` only on explicit go
