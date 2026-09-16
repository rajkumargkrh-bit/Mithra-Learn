# SolluEnglish

A small onboarding + practice-chat demo for a Tamil/Tanglish spoken-English
learning app. Pure HTML/CSS/JS, no build step, no backend — all user answers
are saved in the browser's `localStorage`.

## Files
- `index.html` — page shell
- `style.css` — dark, single-accent design system
- `script.js` — screen flow, state, localStorage, mock chat

## Run it locally
Just open `index.html` in a browser — no server needed.
(Or, for a local server: `python3 -m http.server` in this folder, then visit
`http://localhost:8000`.)

## Put it on GitHub Pages
1. Create a new repo and push these three files to it.
2. On GitHub: **Settings → Pages → Source → Deploy from a branch**, pick
   `main` and `/ (root)`, then **Save**.
3. GitHub gives you a link like `https://<username>.github.io/<repo>/` —
   that's your live app.

## What's saved to localStorage
Key: `solluenglish_profile` →
```json
{ "partner": "yes|no", "level": "...", "goal": "...", "streak": 1, "joinedAt": "..." }
```
Use the **Reset profile** button on the home screen to clear it and
re-run onboarding.

## Extending it
- Swap the emoji avatar in `companion()` (script.js) for a real illustration.
- Replace `NOVA_REPLIES` in script.js with real API calls once you wire up
  a backend or an LLM.
- Add more onboarding questions by adding a new key to `ONBOARDING_STEPS`
  and a matching `screen...()` renderer + entry in `RENDERERS`.
