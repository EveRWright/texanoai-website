# Assets

- `logo-wings.jpg` — Order winged wordmark (optional binary; decode from `.b64` if missing)
- `logo-wings.jpg.b64` — base64 sidecar for text-only transports
- `logo-primary.svg` — June 2026 primary lockup
- `favicon.svg` — Order gold star on midnight

`index.html` hydrates the header mark from the `.b64` sidecar if the JPEG is absent.
Decode locally: `python3 scripts/decode_assets.py`
