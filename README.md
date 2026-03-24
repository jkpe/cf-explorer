# CF Explorer

A Cloudflare Worker that serves a browser UI for exploring [Workers KV](https://developers.cloudflare.com/kv/) namespaces and [D1](https://developers.cloudflare.com/d1/) databases in your Cloudflare account. Credentials are stored as Worker secrets. Access is gated by Cloudflare Access & JWT verification.

## Setup

### 1. Create a read-only API token

In the Cloudflare dashboard, create an API token with these permissions:

- `D1 Read`
- `Workers KV Read`

Copy the generated token.

### 2. Set secrets

```bash
wrangler secret put CF_API_KEY      # API token from step 1
wrangler secret put CF_ACCOUNT_ID   # your Cloudflare account ID
wrangler secret put TEAM_DOMAIN     # https://<your-team>.cloudflareaccess.com
wrangler secret put POLICY_AUD      # AUD tag from Access > Applications > Configure > Basic info
```

### 3. Install & run locally

```bash
npm install
npm run dev
```

Open http://localhost:8787. JWT verification is skipped locally via the `DEV_BYPASS` var in `wrangler.jsonc`.

### 4. Deploy

```bash
npm run deploy
```

## How it works

- The Worker serves `public/` as a static site
- On startup, the app fetches `/config` to get the account ID — the API key is never exposed to the browser
- All Cloudflare API calls go through `/api/*`, where the Worker injects the `CF_API_KEY` secret server-side
- Every request is authenticated by verifying the `Cf-Access-Jwt-Assertion` header set by Cloudflare Access

## Features

- **[Workers KV](https://developers.cloudflare.com/kv/) Explorer** — browse namespaces, list/search keys, view values with JSON formatting
- **[D1](https://developers.cloudflare.com/d1/) Explorer** — browse databases, run SQL queries, sortable results table
