from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "gallery-originals"
GALLERY_DIR = ROOT / "public" / "gallery"
THUMBNAIL_DIR = GALLERY_DIR / "thumbs"
OPTIMIZED_DIR = GALLERY_DIR / "optimized"

THUMBNAIL_SIZE = (600, 600)
OPTIMIZED_SIZE = (1800, 1800)


def main():
    sources = sorted(
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg"}
    )
    if not sources:
        raise SystemExit(f"No JPEG photos found in {SOURCE_DIR}")

    THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    for source_path in sources:
        with Image.open(source_path) as source:
            profile = source.info.get("icc_profile")
            image = ImageOps.exif_transpose(source).convert("RGB")

        name = f"{source_path.stem}.webp"
        optimized = image.copy()
        optimized.thumbnail(OPTIMIZED_SIZE, Image.Resampling.LANCZOS)
        optimized.save(
            OPTIMIZED_DIR / name,
            "WEBP",
            quality=82,
            method=6,
            icc_profile=profile,
        )

        thumbnail = image.copy()
        thumbnail.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
        thumbnail.save(
            THUMBNAIL_DIR / name,
            "WEBP",
            quality=78,
            method=6,
            icc_profile=profile,
        )
        print(f"Optimized {source_path.name}")


if __name__ == "__main__":
    main()
