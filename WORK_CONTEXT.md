# Zigme Work Context

Last updated: 2026-07-08

## Project Shape

Zigme is a Cloudflare Workers app with one static HTML app and one Worker API route.

- Static app: `public/index.html`
- Editable mirror for local/static reference: `index.html`
- Worker entry: `src/worker.js`
- Config: `wrangler.jsonc`
- Production URL: `https://zigme.ekaledma.workers.dev`
- GitHub remote: `https://github.com/Dmazone/zigme.git`

When changing the frontend, keep `index.html` and `public/index.html` synchronized. The Worker serves `public/index.html`.

## Current Product Direction

The current design goal is not modern or polished. It should feel like a senior-friendly, old digital greeting card:

- Large text for phone users with weaker eyesight
- Free web font: `Gowun Batang` for the main Korean serif tone
- Bright yellow/red/cream palette
- Slightly awkward, solemn, "엄근진 병맛" tone
- Low-resolution, pixel/dithered card visuals
- Flower, bird, glitter, old GIF/card aesthetic
- Avoid high-end neon/modern SaaS styling

## Card Generation

The image card background is generated locally in canvas. It does not fetch large external images.

Important functions in `index.html`:

- `fallback(ctx,w,h,seed)`: draws the low-resolution flower/bird/glitter card background.
- `bake(card)`: renders the downloadable/shareable card image.
- `fetchBlobUrl()`: intentionally returns an empty string now to avoid external image downloads.
- `LOCAL_TEMPLATES`: fallback text prompts and old-style greeting content.

The generated card uses:

- Large red Korean text
- Cream/yellow outlines
- Pixelated canvas rendering
- Decorative flower and bird blocks

## Gemini API

The browser no longer calls Gemini directly. It calls:

```text
POST /api/gemini
```

The Worker reads `GEMINI_API_KEY` from Cloudflare secret or `.dev.vars`.

Worker prompt direction:

- Korean senior greeting card copy
- Solemn but lightly absurd
- Short JSON only
- No markdown

Local setup:

```powershell
npm install
npm run dev
```

Production secret setup is documented in `API_KEY_SETUP.md`.

## Religion Selector

The religion feature is frontend-only and does not call AI.

Relevant data:

- `RELIGIONS` constant in `index.html`
- Each item has `id`, `label`, and `messages`
- `religionById(id)` finds the item
- `religionMessage(religion, seed)` picks a deterministic random message
- `chooseReligion(id)` updates selected religion and displays an "엄숙한 한마디"

Current included categories include:

- Catholic, Protestant, Orthodox
- Buddhism, Confucianism, Islam, Hinduism
- Zoroastrianism, Shinto, Sikhism, Jainism, Taoism, Judaism
- Bahai, Tenrikyo, Cheondogyo, Won Buddhism, Jeungsan-related
- LDS, Jehovah's Witnesses, Unitarian, animism/shamanism, spirituality/meditation, other minority religions

Tone rule: do not mock a religion. The humor should come from overly solemn UI phrasing, not from disrespecting beliefs.

## Verification Commands

Run before committing:

```powershell
node --check src\worker.js
npm run check
```

Useful runtime checks:

```powershell
npm run dev -- --port 8787
Invoke-WebRequest -Uri http://127.0.0.1:8787/ -UseBasicParsing
```

API check:

```powershell
$body = @{
  mood = @{ label='복 기운'; text='오늘은 복이 좀 들썩이는 날입니다.' }
  target = @{ label='가족방'; tone='따뜻하고 큼직하게' }
  env = @{ season='여름'; time='오후' }
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri http://127.0.0.1:8787/api/gemini -Method Post -ContentType 'application/json' -Body $body
```

## Deployment

Commit and push to GitHub:

```powershell
git add index.html public/index.html src/worker.js
git commit -m "Message"
git push origin main
```

Deploy to Cloudflare:

```powershell
npm run deploy
```

Latest known deployed URL:

```text
https://zigme.ekaledma.workers.dev
```

