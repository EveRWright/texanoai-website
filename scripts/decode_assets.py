#!/usr/bin/env python3
"""Decode *.b64 sidecars next to binary assets (for text-only git transports)."""
from pathlib import Path
import base64
root = Path(__file__).resolve().parents[1] / "assets"
for p in root.glob("*.b64"):
    out = root / p.name[:-4]
    out.write_bytes(base64.b64decode(p.read_text().encode()))
    print("wrote", out, out.stat().st_size)
