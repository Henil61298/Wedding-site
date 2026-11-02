import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "./rsvp.js";

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = JSON.parse(body);
    },
  };
}

function createRequest(overrides = {}) {
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "wedding.example",
      origin: "https://wedding.example",
    },
    body: {
      id: "c1b2a7f3-479a-4f4f-9f2d-c6b584af9b80",
      name: "  Wedding Guest  ",
      attendance: "yes",
      wishes: "  Congratulations!  ",
    },
    ...overrides,
  };
}

test("Vercel RSVP endpoint upserts a validated response to Supabase", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let request;
  process.env.SUPABASE_URL = "https://project.supabase.co/";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "server-only-test-key";
  globalThis.fetch = async (...args) => {
    request = args;
    return { ok: true };
  };

  try {
    const res = createResponse();
    await handler(createRequest(), res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { saved: true });
    assert.equal(request[0], "https://project.supabase.co/rest/v1/rsvps?on_conflict=id");
    assert.equal(request[1].headers.apikey, "server-only-test-key");
    assert.equal(request[1].headers.Authorization, "Bearer server-only-test-key");
    assert.equal(request[1].headers.Prefer, "resolution=merge-duplicates,return=minimal");
    const saved = JSON.parse(request[1].body);
    assert.equal(saved.name, "Wedding Guest");
    assert.equal(saved.attending, true);
    assert.equal(saved.id, "c1b2a7f3-479a-4f4f-9f2d-c6b584af9b80");
    assert.equal(saved.wishes, "Congratulations!");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
});

test("Vercel RSVP endpoint rejects invalid and cross-origin submissions", async () => {
  const invalidRes = createResponse();
  await handler(createRequest({ body: { name: "", attendance: "yes" } }), invalidRes);
  assert.equal(invalidRes.statusCode, 400);

  const longWishesRes = createResponse();
  await handler(
    createRequest({
      body: { ...createRequest().body, wishes: "w".repeat(1001) },
    }),
    longWishesRes,
  );
  assert.equal(longWishesRes.statusCode, 400);

  const originRes = createResponse();
  await handler(
    createRequest({
      headers: {
        "content-type": "application/json",
        host: "wedding.example",
        origin: "https://attacker.example",
      },
    }),
    originRes,
  );
  assert.equal(originRes.statusCode, 403);
});
