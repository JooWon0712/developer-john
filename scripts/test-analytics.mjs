import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../src/lib/analytics.ts", import.meta.url), "utf8");
const { analytics, analyticsInitialization, shouldLoadAnalytics } = await import("data:text/javascript;base64," + Buffer.from(stripTypeScriptTypes(source)).toString("base64"));

test("analytics requires production and an approved HTTPS origin", () => {
  for (const origin of ["https://developer-john.com", "https://www.developer-john.com"]) {
    assert.equal(shouldLoadAnalytics(origin, true), true);
    assert.equal(shouldLoadAnalytics(origin, false), false);
  }
});

test("local, preview, HTTP, alternate ports and lookalike domains never load analytics", () => {
  for (const origin of [
    "http://127.0.0.1:3004", "http://localhost:3000", "https://localhost",
    "http://developer-john.com", "http://www.developer-john.com",
    "https://developer-john.com:3004", "https://preview.developer-john.com",
    "https://developer-john.com.example.org", "https://fake-developer-john.com",
    "https://developer-john.com@example.org", "null", "",
  ]) assert.equal(shouldLoadAnalytics(origin, true), false, origin);
});

test("initialization preserves queued entries and configures one stream without custom events", () => {
  const queued = { existing: true };
  const browser = { dataLayer: [queued] };
  runInNewContext(analyticsInitialization, { window: browser });
  assert.equal(browser.dataLayer[0], queued);
  assert.equal(browser.dataLayer.length, 3);
  const commands = browser.dataLayer.slice(1).map(args => Array.from(args));
  assert.equal(commands[0][0], "js");
  assert.ok(Number.isFinite(commands[0][1].getTime()));
  assert.deepEqual(commands[1], ["config", analytics.measurementId]);
  assert.equal(analytics.measurementId, "G-17PE2KX72Q");
});
