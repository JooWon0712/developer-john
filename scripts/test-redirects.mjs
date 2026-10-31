import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { readFileSync } from "node:fs";
import { createRequire, stripTypeScriptTypes } from "node:module";
import test from "node:test";

// The plain Node test runner needs the same native storage primitive as Next.
globalThis.AsyncLocalStorage ??= AsyncLocalStorage;
const { getRedirectUrl, unstable_getResponseFromNextConfig } = await import("next/experimental/testing/server.js");

const source = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const { default: nextConfig } = await import("data:text/javascript;base64," + Buffer.from(stripTypeScriptTypes(source)).toString("base64"));
const canonical = "https://developer-john.com";
const publicHosts = ["developer-john.com", "www.developer-john.com"];

function responseFor(url, forwardedProto, host) {
  const headers = {};
  if (forwardedProto !== undefined) headers["x-forwarded-proto"] = forwardedProto;
  if (host !== undefined) headers.host = host;
  return unstable_getResponseFromNextConfig({ url, headers, nextConfig });
}

async function assertNoRedirect(url, forwardedProto, host) {
  const response = await responseFor(url, forwardedProto, host);
  assert.equal(getRedirectUrl(response), null, `${url} (${forwardedProto ?? "missing forwarded protocol"})`);
  assert.equal(response.status, 200);
}

test("public HTTP home requests receive a permanent redirect to the canonical HTTPS origin", async () => {
  for (const host of publicHosts) {
    const response = await responseFor(`http://${host}/`, "http");
    assert.equal(response.status, 308);
    assert.equal(getRedirectUrl(response), `${canonical}/`);
  }
});

test("HTTPS upgrades preserve Korean and English deep paths and encoded query values", async () => {
  for (const host of publicHosts) {
    for (const prefix of ["", "/en"]) {
      const path = `${prefix}/services/game/the-division-2/red-moon-unleashed-2026`;
      const response = await responseFor(`http://${host}${path}?source=share&name=%EB%A0%88%EB%93%9C+%EB%AC%B8`, "http");
      assert.equal(response.status, 308);
      const destination = new URL(getRedirectUrl(response));
      assert.equal(destination.origin, canonical);
      assert.equal(destination.pathname, path);
      assert.equal(destination.searchParams.get("source"), "share");
      assert.equal(destination.searchParams.get("name"), "레드 문");
    }
  }
});

test("the HTTPS redirect also covers ads.txt and the public share image", async () => {
  for (const path of ["/ads.txt", "/brand/social-preview-small-workspace-v5.jpg"]) {
    for (const host of publicHosts) {
      const response = await responseFor(`http://${host}${path}`, "http");
      assert.equal(response.status, 308);
      assert.equal(getRedirectUrl(response), canonical + path);
    }
  }
});

test("HTTPS requests and the destination of an upgrade do not redirect again", async () => {
  for (const host of publicHosts) {
    for (const path of ["/", "/en", "/services/game/the-division-2", "/ads.txt"]) {
      await assertNoRedirect(`https://${host}${path}`, "https");
    }
  }
  const response = await responseFor("http://www.developer-john.com/en?source=share", "http");
  assert.equal(response.status, 308);
  await assertNoRedirect(getRedirectUrl(response), "https");
});

// This checks the configured matcher, not server header normalization. The real
// server may infer HTTP when X-Forwarded-Proto is missing; HTTPS proxies must set it.
test("the config matcher requires the exact single HTTP forwarded-protocol value", async () => {
  for (const proto of [undefined, "", "https", "HTTP", "httpx", "ftp", "http ", "http, https", "https, http", "http,http"]) {
    for (const host of publicHosts) await assertNoRedirect(`http://${host}/`, proto);
  }
});

test("local development, health requests and unrelated or lookalike hosts are excluded", async () => {
  for (const origin of [
    "http://localhost:3004", "http://127.0.0.1:3000", "http://127.0.0.1:3310",
    "http://example.org", "http://preview.developer-john.com", "http://fake-developer-john.com",
    "http://developer-john.com.example.org", "http://developer-johnXcom", "http://www.developer-john.com.example.org",
  ]) {
    for (const path of ["/", "/health"]) {
      await assertNoRedirect(origin + path, "http");
      await assertNoRedirect(origin + path, undefined);
    }
  }
});

test("proxied requests use the public Host and forwarded protocol rather than the internal HTTP URL", async () => {
  const internalUrl = "http://127.0.0.1:3310/en/services";
  for (const host of publicHosts) {
    const response = await responseFor(internalUrl, "http", host);
    assert.equal(response.status, 308);
    assert.equal(getRedirectUrl(response), `${canonical}/en/services`);
    await assertNoRedirect(internalUrl, "https", host);
  }
});

test("existing Korean and English game redirects remain permanent and preserve paths and queries", async () => {
  for (const prefix of ["", "/en"]) {
    for (const suffix of ["", "/red-moon-unleashed-2026"]) {
      const response = await responseFor(`${canonical}${prefix}/game/the-division-2${suffix}?source=old-link`, "https");
      assert.equal(response.status, 308);
      assert.equal(getRedirectUrl(response), `${canonical}${prefix}/services/game/the-division-2${suffix}?source=old-link`);
    }
  }
});

test("HTTP legacy game links upgrade HTTPS before following the existing path redirect", async () => {
  for (const prefix of ["", "/en"]) {
    const path = `${prefix}/game/the-division-2/red-moon-unleashed-2026`;
    const upgrade = await responseFor(`http://www.developer-john.com${path}?source=old-link`, "http");
    assert.equal(upgrade.status, 308);
    assert.equal(getRedirectUrl(upgrade), `${canonical}${path}?source=old-link`);
    const legacy = await responseFor(getRedirectUrl(upgrade), "https");
    assert.equal(legacy.status, 308);
    assert.equal(getRedirectUrl(legacy), `${canonical}${prefix}/services/game/the-division-2/red-moon-unleashed-2026?source=old-link`);
    await assertNoRedirect(getRedirectUrl(legacy), "https");
  }
});

test("the configured HTTPS destination preserves repeated query values with Next production serialization", async () => {
  // Next 16.4.3's experimental response helper turns query arrays into one comma-
  // joined value. Exercise the installed production matcher/destination/serializer
  // for this case; do not repair the helper's Location or duplicate redirect rules.
  const require = createRequire(import.meta.url);
  const { getPathMatch } = require("next/dist/shared/lib/router/utils/path-match");
  const { matchHas, prepareDestination } = require("next/dist/shared/lib/router/utils/prepare-destination");
  const { parseUrl } = require("next/dist/shared/lib/router/utils/parse-url");
  const { formatUrl } = require("next/dist/shared/lib/router/utils/format-url");
  const { addRequestMeta } = require("next/dist/server/request-meta");
  const { stringifyQuery } = require("next/dist/server/server-route-utils");
  const [rule] = await nextConfig.redirects();

  for (const prefix of ["", "/en"]) {
    const input = new URL(`http://www.developer-john.com${prefix}/services/game/the-division-2?tag=one&tag=two&name=%EB%A0%88%EB%93%9C+%EB%AC%B8&empty=`);
    const query = parseUrl(input.href).query;
    const request = { headers: { host: input.host, "x-forwarded-proto": "http" } };
    const pathParams = getPathMatch(rule.source)(input.pathname);
    const headerParams = matchHas(request, query, rule.has, rule.missing);
    assert.ok(pathParams);
    assert.ok(headerParams);
    const { parsedDestination } = prepareDestination({
      appendParamsToQuery: false,
      destination: rule.destination,
      params: { ...pathParams, ...headerParams },
      query,
    });
    addRequestMeta(request, "initQuery", query);
    const { query: destinationQuery, ...target } = parsedDestination;
    target.search = stringifyQuery(request, destinationQuery);
    const destination = new URL(formatUrl(target));
    const response = await responseFor(input.href, "http");
    const helperDestination = new URL(getRedirectUrl(response));
    assert.equal(response.status, 308);
    assert.equal(destination.origin, canonical);
    assert.equal(destination.pathname, input.pathname);
    assert.equal(helperDestination.origin, destination.origin);
    assert.equal(helperDestination.pathname, destination.pathname);
    assert.equal(destination.searchParams.size, input.searchParams.size);
    for (const key of new Set(input.searchParams.keys())) {
      assert.deepEqual(destination.searchParams.getAll(key), input.searchParams.getAll(key), key);
    }
  }
});
