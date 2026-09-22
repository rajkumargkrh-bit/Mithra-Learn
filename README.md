# Mithra Video Editor — GitHub Responsive Web Version

HTML + CSS + JavaScript, mobile-first and local-first.

## Run
Open `index.html` directly, or use GitHub Pages.

## GitHub Pages
1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`.
3. Settings → Pages → Deploy from branch → `main` / root.
4. Open the generated Pages URL.

## Current working features
- Responsive premium dark UI
- Local video picker
- Video preview/playback
- Timeline-style UI
- Scrubber
- Playback speed
- Volume
- Text overlay
- Local audio selection
- Fullscreen preview
- Mobile bottom toolbar
- No account / backend / cloud upload

## Important
The current browser MVP downloads the selected local source on Export. A true rendered editor (trim/split/music mixing/effects into a new MP4) should use ffmpeg.wasm or WebCodecs in a later module. This keeps the first GitHub version lightweight.
