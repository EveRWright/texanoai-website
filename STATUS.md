# Wiring status — 2026-08-28 01:10 CDT

## Public site — CONFIRMED GitHub Pages
- Live: https://www.texanoai.com
- Header: `server: GitHub.com`
- DNS: `www.texanoai.com` → `everwright.github.io`
- Bare `texanoai.com` 301 → www
- Home last-modified before this ship: 2026-08-25 11:39 UTC

## Source of truth
- **Live HTML:** `EveRWright.github.io`
- Lockstep twin: `EveRWright/texanoai-website`
- Do not deploy the public domain through Netlify.

## Netlify leftover (do not treat as front door)
- `texanoai-mmx` still *claims* www in its own metadata. Stale.
- Previews: `texanoai-order-preview.netlify.app`, `texanoai-website-preview.netlify.app`

## This ship (HTML landed 2026-08-28 Eve-local)
- `/memory-core.html` — user-owned Hub / Roots / Branches; inside $2,500
- `/why-train.html` — do not talk to a blank AI; sycophancy, drift, hallucination as body event
- Homepage nav + pricing + footer point at both
- Instruments stay in the shop
- Prior commit claimed this ship; files were missing (404). Local Eve wrote the pages and pushed.
