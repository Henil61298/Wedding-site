Keep original photos in the project-root gallery-originals/ folder, not in public/. Install Pillow if needed, then run the orientation-aware optimizer:

  python3 -m pip install Pillow
  python3 scripts/optimize-gallery.py

Add {src: "/gallery/optimized/filename.webp", alt: "Photo description"} to wedding.gallery in src/config.js. The site uses the thumbnail in the gallery and the optimized image when opened. The optimizer applies each JPEG's EXIF orientation before writing both WebP versions. The first four show initially; Expand gallery reveals the rest.
