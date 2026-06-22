#!/usr/bin/env python3
"""Generate favicons from logo-mark.png — crop transparent padding so mark reads larger."""
from __future__ import annotations

import struct
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow required: pip install Pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent / "client" / "public"
SRC = ROOT / "logo-mark.png"
SIZES = [16, 32, 48, 192, 512]
PAD_RATIO = 0.06  # minimal padding after crop


def crop_to_content(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    bbox = rgba.getbbox()
    if not bbox:
        return rgba
    cropped = rgba.crop(bbox)
    w, h = cropped.size
    pad = int(max(w, h) * PAD_RATIO)
    side = max(w, h) + pad * 2
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(cropped, ((side - w) // 2, (side - h) // 2))
    return canvas


def write_ico(images: list[tuple[int, Image.Image]], dest: Path) -> None:
    """Minimal multi-size ICO writer."""
    entries = []
    image_data = []
    offset = 6 + 16 * len(images)

    for size, img in images:
        png_bytes = _png_bytes(img)
        entries.append((size, len(png_bytes), offset))
        image_data.append(png_bytes)
        offset += len(png_bytes)

    with dest.open("wb") as f:
        f.write(struct.pack("<HHH", 0, 1, len(images)))
        for (size, length, off) in entries:
            f.write(
                struct.pack(
                    "<BBBBHHII",
                    size if size < 256 else 0,
                    size if size < 256 else 0,
                    0,
                    0,
                    1,
                    32,
                    length,
                    off,
                )
            )
        for data in image_data:
            f.write(data)


def _png_bytes(img: Image.Image) -> bytes:
    from io import BytesIO

    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def main() -> None:
    if not SRC.exists():
        print(f"Missing {SRC}", file=sys.stderr)
        sys.exit(1)

    base = crop_to_content(Image.open(SRC))
    ico_sizes: list[tuple[int, Image.Image]] = []

    for dim in SIZES:
        resized = base.resize((dim, dim), Image.Resampling.LANCZOS)
        name = f"favicon-{dim}.png" if dim != 512 else None
        if name:
            out = ROOT / name
            resized.save(out, "PNG", optimize=True)
            print(f"  wrote {out.name} ({dim}x{dim})")
        if dim in (16, 32, 48):
            ico_sizes.append((dim, resized))

    apple = base.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save(ROOT / "apple-touch-icon.png", "PNG", optimize=True)
    print("  wrote apple-touch-icon.png (180x180)")

    write_ico(ico_sizes, ROOT / "favicon.ico")
    print("  wrote favicon.ico")


if __name__ == "__main__":
    main()
