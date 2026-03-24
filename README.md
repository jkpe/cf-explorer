# CF Explorer

A Cloudflare Worker that serves a browser UI for exploring [Workers KV](https://developers.cloudflare.com/kv/) namespaces and [D1](https://developers.cloudflare.com/d1/) databases in your Cloudflare account. Credentials are stored as Worker secrets. Access is gated by Cloudflare Access & JWT verification.

## Read-only only

For sanity :-), this tool only supports read-only operations.

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

- The Worker has three routes:
  - `GET /config` returns `{ accountId }` from `CF_ACCOUNT_ID`
  - `/api/*` proxies to `https://api.cloudflare.com/client/v4/*`
  - all other paths are served as static assets via the `ASSETS` binding
- API credentials stay server-side: the browser never receives `CF_API_KEY`; the Worker injects it as a Bearer token when proxying `/api/*` requests
- Cloudflare Access JWT validation runs on every request using `TEAM_DOMAIN` + `POLICY_AUD` (`Cf-Access-Jwt-Assertion` header)
- Local development can bypass JWT verification when `DEV_BYPASS=true`
- The frontend keeps navigation state in the URL hash (`#kv/...` / `#d1/...`) so links are shareable and restorable on refresh

## Features

- **[Workers KV](https://developers.cloudflare.com/kv/) Explorer** — browse namespaces, list/search keys, view values with JSON formatting
- **[D1](https://developers.cloudflare.com/d1/) Explorer** — browse databases, run SQL queries, sortable results table
- **URL hash deep links** — share or bookmark the exact KV/D1 view you are on (tab, selected namespace/database, selected key/table)

## URL hash navigation

The app keeps your current view in the URL hash so refresh/share/bookmark works.

Examples:

- `#kv` — open the KV tab
- `#kv/<namespace-id>` — open a specific KV namespace
- `#kv/<namespace-id>/<url-encoded-key-name>` — open a specific KV key value
- `#d1` — open the D1 tab
- `#d1/<database-uuid>` — open a specific D1 database
- `#d1/<database-uuid>/<url-encoded-table-name>` — open a specific table query (`SELECT * FROM "<table>" LIMIT 100;`)

Note: key/table names in the URL are URL-encoded.
