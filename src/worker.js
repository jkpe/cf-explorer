/**
 * CF Explorer — Worker
 *
 * All requests are verified against a Cloudflare Access JWT before being handled.
 *
 * GET /config   → returns { accountId } from env secrets (never exposes the API key)
 * /api/*        → proxied server-side to api.cloudflare.com using env.CF_API_KEY
 * *             → static assets from public/
 *
 * Required secrets (set with `wrangler secret put`):
 *   CF_API_KEY     – Cloudflare API token with KV + D1 read permissions
 *   CF_ACCOUNT_ID  – Cloudflare account ID
 *   TEAM_DOMAIN    – https://<your-team-name>.cloudflareaccess.com
 *   POLICY_AUD     – Application Audience (AUD) tag from the Access application
 */
import { jwtVerify, createRemoteJWKSet } from "jose";

export default {
  async fetch(request, env) {
    const unauthorized = await verifyAccessJwt(request, env);
    if (unauthorized) return unauthorized;

    const url = new URL(request.url);

    if (url.pathname === "/config") {
      return Response.json({ accountId: env.CF_ACCOUNT_ID });
    }

    if (url.pathname.startsWith("/api/")) {
      return proxyToCloudflare(request, url, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function verifyAccessJwt(request, env) {
  if (env.DEV_BYPASS === "true") return null;

  if (!env.TEAM_DOMAIN || !env.POLICY_AUD) {
    const missing = [
      !env.TEAM_DOMAIN && "TEAM_DOMAIN",
      !env.POLICY_AUD && "POLICY_AUD",
    ].filter(Boolean);
    return new Response(
      `Configuration Error: missing required secret(s): ${missing.join(", ")}.`,
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    return new Response("Missing Cf-Access-Jwt-Assertion header", { status: 403 });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${env.TEAM_DOMAIN}/cdn-cgi/access/certs`)
    );
    await jwtVerify(token, JWKS, {
      issuer: env.TEAM_DOMAIN,
      audience: env.POLICY_AUD,
    });
  } catch (err) {
    return new Response(`Invalid Access token: ${err.message}`, { status: 403 });
  }

  return null; // valid
}

async function proxyToCloudflare(request, url, env) {
  const cfPath = url.pathname.slice("/api".length) + url.search;
  const cfUrl = `https://api.cloudflare.com/client/v4${cfPath}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${env.CF_API_KEY}`);
  headers.set("Content-Type", "application/json");

  const upstream = await fetch(cfUrl, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}
