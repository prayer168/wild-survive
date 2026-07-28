"""Create the 1200×630 social card from the project-owned Image 2.0 hero."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images" / "hero.png"
OUTPUT = ROOT / "assets" / "images" / "social-preview.png"
FONT_REGULAR = Path(r"C:\Windows\Fonts\msjh.ttc")
FONT_BOLD = Path(r"C:\Windows\Fonts\msjhbd.ttc")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size, index=0)


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    target_ratio = 1200 / 630
    source_ratio = source.width / source.height

    if source_ratio > target_ratio:
        crop_width = round(source.height * target_ratio)
        left = (source.width - crop_width) // 2
        crop_box = (left, 0, left + crop_width, source.height)
    else:
        crop_height = round(source.width / target_ratio)
        top = max(0, (source.height - crop_height) // 2 - 35)
        crop_box = (0, top, source.width, top + crop_height)

    canvas = source.crop(crop_box).resize((1200, 630), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    pixels = overlay.load()
    for x in range(1200):
        left_alpha = int(218 * max(0, 1 - x / 880))
        bottom_alpha = int(70 * max(0, (x - 600) / 600))
        alpha = max(left_alpha, bottom_alpha)
        for y in range(630):
            vertical = int(30 * (y / 630))
            pixels[x, y] = (8, 29, 23, min(235, alpha + vertical))

    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas)

    amber = "#F0C57F"
    white = "#FFFDF7"
    sage = "#C7D0C1"

    draw.rounded_rectangle((64, 55, 402, 96), radius=20, fill=(13, 32, 27, 205), outline=(240, 197, 127, 150), width=2)
    draw.text((88, 65), "WILDERNESS SAFETY · TAIWAN", font=font(FONT_BOLD, 18), fill=amber)
    draw.text((64, 153), "野外求生", font=font(FONT_BOLD, 86), fill=white)
    draw.text((64, 258), "安全手冊", font=font(FONT_BOLD, 86), fill=amber)
    draw.line((66, 388, 506, 388), fill=(240, 197, 127, 180), width=3)
    draw.text((66, 423), "先準備，才出發。", font=font(FONT_BOLD, 34), fill=white)
    draw.text((66, 482), "辨識風險 · 保暖定位 · 平安回家", font=font(FONT_REGULAR, 25), fill=sage)
    draw.text((66, 554), "prayer168.github.io/wild-survive/", font=font(FONT_REGULAR, 20), fill=amber)

    canvas.convert("RGB").save(OUTPUT, "PNG", optimize=True)
    print(f"saved {OUTPUT} ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
