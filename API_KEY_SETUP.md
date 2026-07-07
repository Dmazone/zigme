# Gemini API Key Setup

Production uses a Cloudflare Worker secret, not a browser JavaScript file.

1. Run `npm install`.
2. Run `npx wrangler secret put GEMINI_API_KEY`.
3. Paste your Gemini API key when Wrangler asks.
4. Run `npm run deploy`.

For local Worker dev, put this in `.dev.vars`:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Do not commit `.dev.vars` or any file containing the real key.
