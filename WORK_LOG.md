# Zigme Work Log

Last updated: 2026-07-08

## Current Git State

Latest commits:

```text
9e22f6c Add solemn religion greeting selector
7a33e0f Retheme cards for senior-friendly greetings
69142fa Move Gemini calls to Worker and improve responsive layout
5ccc0e2 Fix GitHub Pages runtime boot
f07c460 Add zigme single page app
```

Current deployed Worker URL:

```text
https://zigme.ekaledma.workers.dev
```

## Completed Work

### Worker Migration

- Added Cloudflare Workers project files.
- Added `src/worker.js`.
- Added `wrangler.jsonc`.
- Added `package.json` scripts:
  - `npm run dev`
  - `npm run deploy`
  - `npm run check`
- Moved Gemini calls behind `/api/gemini`.
- Removed browser-side Gemini key dependency from the main flow.
- Added `API_KEY_SETUP.md`.

### Responsive Layout Rebuild

- Reworked the app from PC-first to mobile-first.
- Mobile now shows the card preview first.
- Desktop uses a two-column layout:
  - left: card preview/actions
  - right: controls
- Verified mobile layout via Chrome/CDP with 390px viewport.
- Fixed horizontal overflow from canvas intrinsic width.

### Senior-Friendly Retheme

- Replaced modern neon style with old digital greeting-card styling.
- Switched main Korean font to `Gowun Batang`.
- Increased UI font sizes.
- Added yellow/red/cream, double-border, dashed-border, and pixelated styling.
- Replaced polished card visuals with canvas-generated low-resolution flower/bird/glitter backgrounds.
- Disabled external image background fetches by making `fetchBlobUrl()` return `""`.
- Updated local fallback messages to senior-friendly greeting/health/luck copy.
- Updated Worker Gemini prompt to generate senior greeting card text with solemn but lightly absurd tone.

### Religion Selector

- Added a `종교가 있으신가요` selector.
- Added 25 religion/spirituality options.
- Added frontend-only static message DB.
- Selecting a religion displays a random "엄숙한 한마디".
- Card generation also refreshes the selected religion message.
- Verified dropdown rendering and static message output through browser DOM automation.

## Verification Already Done

Recently verified:

```text
node --check src\worker.js
npm run check
npm run deploy
```

Also verified:

- `/api/gemini` returns `quote`, `subtext`, and `prompt`.
- Religion dropdown has 25 options.
- Selecting Buddhism displayed:
  - `엄숙한 한마디: 마음 한 번 내려놓으면 복이 조용히 앉습니다.`

## Deployment History

### 69142fa

Message:

```text
Move Gemini calls to Worker and improve responsive layout
```

Included:

- Worker API proxy
- Cloudflare config
- mobile-first layout

### 7a33e0f

Message:

```text
Retheme cards for senior-friendly greetings
```

Included:

- senior-friendly visual retheme
- larger text
- old digital flower/bird card generation
- Worker prompt update

### 9e22f6c

Message:

```text
Add solemn religion greeting selector
```

Included:

- religion dropdown
- static religion message database
- random frontend message display
- Cloudflare deployment

## Current Operating Convention

The user asked:

```text
항상 만들어주고 웹에도 반영 바로 해줘
```

So for future implementation requests:

1. Make the change.
2. Sync `index.html` to `public/index.html` when frontend changes.
3. Run checks.
4. Commit and push to `origin/main`.
5. Run `npm run deploy` when the web app behavior changes.

