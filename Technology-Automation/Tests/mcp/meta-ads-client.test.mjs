import test from "node:test";
import assert from "node:assert/strict";

import {
  MetaApiError,
  createMetaClient,
} from "../../MCP/meta-ads/meta-client.mjs";
import { safeError } from "../../MCP/meta-ads/redact.mjs";

const GRAPH_BASE = "https://graph.example.test/v26.0/";
const TOKEN = "test-token-value";

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

function sequenceFetch(responses, calls = []) {
  let index = 0;

  return async (url, options = {}) => {
    calls.push({ url: String(url), options });
    const response = responses[index];
    index += 1;
    return typeof response === "function" ? response() : response;
  };
}

test("GET builds the injected Graph URL and serializes Meta parameters", async () => {
  const calls = [];
  const params = {
    fields: "id,name,status",
    limit: 25,
    include_summary: true,
    filtering: [
      {
        field: "effective_status",
        operator: "IN",
        value: ["ACTIVE", "PAUSED"],
      },
    ],
    time_range: {
      since: "2026-09-01",
      until: "2026-09-15",
    },
    omitted: undefined,
  };
  const original = structuredClone(params);
  original.omitted = undefined;
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch([jsonResponse({ data: [{ id: "1201" }] })], calls),
  });

  const body = await client.get("/act_123/campaigns", params);

  assert.deepEqual(body, { data: [{ id: "1201" }] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, "GET");
  const url = new URL(calls[0].url);
  assert.equal(url.origin, "https://graph.example.test");
  assert.equal(url.pathname, "/v26.0/act_123/campaigns");
  assert.equal(url.searchParams.get("fields"), "id,name,status");
  assert.equal(url.searchParams.get("limit"), "25");
  assert.equal(url.searchParams.get("include_summary"), "true");
  assert.equal(url.searchParams.get("filtering"), JSON.stringify(params.filtering));
  assert.equal(url.searchParams.get("time_range"), JSON.stringify(params.time_range));
  assert.equal(url.searchParams.has("omitted"), false);
  assert.equal(url.searchParams.get("access_token"), TOKEN);
  assert.deepEqual(params, original);
  assert.equal(Object.hasOwn(params, "access_token"), false);
});

test("rejects unsafe Graph object paths before making a request", async () => {
  let calls = 0;
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse({ id: "must-not-run" });
    },
  });
  const invalidPaths = [
    "https://untrusted.example.test/me",
    "//untrusted.example.test/me",
    "act_123/../me",
    "act_123/./campaigns",
    "act_123/%2e%2e/me",
    "me?password=query-secret",
    "me#fragment-secret",
    "act_123\\campaigns",
    "me\u0000control-secret",
    "me/\u007fdelete-secret",
  ];

  for (const path of invalidPaths) {
    await assert.rejects(
      () => client.get(path),
      (error) => {
        assert.ok(error instanceof MetaApiError);
        assert.equal(error.code, "INVALID_PATH");
        assert.equal(error.type, "ClientInputError");
        assert.deepEqual(error.details, { method: "GET" });
        assert.doesNotMatch(
          JSON.stringify(error),
          /query-secret|fragment-secret|control-secret|delete-secret/,
        );
        return true;
      },
    );
  }

  assert.equal(calls, 0);
});

test("POST sends a URL-encoded form without mutating input", async () => {
  const calls = [];
  const params = {
    name: "Hanoi saves campaign",
    daily_budget: 5000,
    is_adset_budget_sharing_enabled: false,
    targeting: {
      geo_locations: { countries: ["VN"] },
      age_min: 21,
    },
    creative_ids: ["9001", "9002"],
  };
  const original = structuredClone(params);
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch([jsonResponse({ id: "2385" })], calls),
  });

  const body = await client.post("act_123/campaigns", params);

  assert.deepEqual(body, { id: "2385" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://graph.example.test/v26.0/act_123/campaigns");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(
    calls[0].options.headers["content-type"],
    "application/x-www-form-urlencoded",
  );
  const form = new URLSearchParams(calls[0].options.body);
  assert.equal(form.get("name"), params.name);
  assert.equal(form.get("daily_budget"), "5000");
  assert.equal(form.get("is_adset_budget_sharing_enabled"), "false");
  assert.equal(form.get("targeting"), JSON.stringify(params.targeting));
  assert.equal(form.get("creative_ids"), JSON.stringify(params.creative_ids));
  assert.equal(form.get("access_token"), TOKEN);
  assert.deepEqual(params, original);
  assert.equal(Object.hasOwn(params, "access_token"), false);
});

test("parameter serialization failures return sanitized MetaApiError values", async () => {
  const circular = {
    password: "circular-object-secret",
  };
  circular.self = circular;

  const throwingToJson = {
    toJSON() {
      throw new Error("throwing-toJSON-secret");
    },
  };

  const cases = [
    ["circular", { targeting: circular }, "circular-object-secret"],
    ["BigInt", { daily_budget: 5000n }, "5000"],
    ["throwing toJSON", { targeting: throwingToJson }, "throwing-toJSON-secret"],
  ];

  for (const [label, params, secret] of cases) {
    let calls = 0;
    const client = createMetaClient({
      graphBase: GRAPH_BASE,
      token: TOKEN,
      fetchImpl: async () => {
        calls += 1;
        return jsonResponse({ id: "must-not-run" });
      },
    });

    await assert.rejects(
      () => client.post("/act_123/campaigns", params),
      (error) => {
        assert.ok(error instanceof MetaApiError, label);
        assert.equal(error.code, "PARAM_SERIALIZATION_FAILED", label);
        assert.equal(error.type, "ClientInputError", label);
        assert.deepEqual(
          error.details,
          {
            method: "POST",
            path: "/v26.0/act_123/campaigns",
          },
          label,
        );
        assert.doesNotMatch(JSON.stringify(error), new RegExp(secret), label);
        return true;
      },
    );
    assert.equal(calls, 0, label);
  }
});

test("URL construction failures return a sanitized MetaApiError", async () => {
  const secret = "invalid-base-secret";
  let calls = 0;
  const client = createMetaClient({
    graphBase: `not a URL ${secret}`,
    token: TOKEN,
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse({ id: "must-not-run" });
    },
  });

  await assert.rejects(
    () => client.get("/me"),
    (error) => {
      assert.ok(error instanceof MetaApiError);
      assert.equal(error.code, "URL_CONSTRUCTION_FAILED");
      assert.equal(error.type, "ClientInputError");
      assert.deepEqual(error.details, { method: "GET" });
      assert.doesNotMatch(JSON.stringify(error), new RegExp(secret));
      return true;
    },
  );
  assert.equal(calls, 0);
});

test("POST never retries transient or rate-limit failures", async () => {
  const calls = [];
  const sleeps = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        jsonResponse(
          {
            error: {
              message: "Please retry",
              type: "OAuthException",
              code: 4,
              is_transient: true,
            },
          },
          429,
        ),
        jsonResponse({ id: "should-not-be-returned" }),
      ],
      calls,
    ),
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(() => client.post("/act_123/campaigns"), MetaApiError);
  assert.equal(calls.length, 1);
  assert.deepEqual(sleeps, []);
});

test("GET retries rate limits and supported server errors up to three attempts", async () => {
  const retryStatuses = [429, 500, 502, 503, 504];

  for (const status of retryStatuses) {
    const calls = [];
    const sleeps = [];
    const client = createMetaClient({
      graphBase: GRAPH_BASE,
      token: TOKEN,
      fetchImpl: sequenceFetch(
        [
          jsonResponse({ error: { message: "Retry later" } }, status),
          jsonResponse({ id: `success-after-${status}` }),
        ],
        calls,
      ),
      sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
      randomImpl: () => 0,
    });

    assert.deepEqual(await client.get("/me"), {
      id: `success-after-${status}`,
    });
    assert.equal(calls.length, 2);
    assert.deepEqual(sleeps, [250]);
  }

  const calls = [];
  const sleeps = [];
  const boundedClient = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        jsonResponse({ error: { message: "Rate limited" } }, 429),
        jsonResponse({ error: { message: "Unavailable" } }, 503),
        jsonResponse({ error: { message: "Still unavailable" } }, 504),
        jsonResponse({ id: "fourth-attempt-must-not-run" }),
      ],
      calls,
    ),
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(() => boundedClient.get("/me"), MetaApiError);
  assert.equal(calls.length, 3);
  assert.deepEqual(sleeps, [250, 500]);
});

test("GET adds injectable jitter to exponential retry delays", async () => {
  const sleeps = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch([
      jsonResponse({ error: { message: "Rate limited" } }, 429),
      jsonResponse({ error: { message: "Unavailable" } }, 503),
      jsonResponse({ id: "1201" }),
    ]),
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0.5,
  });

  await client.get("/me");

  assert.deepEqual(sleeps, [300, 600]);
});

test("GET retries transient errors found in native cause chains", async () => {
  const retrySignals = [
    ["ECONNRESET", "code"],
    ["ETIMEDOUT", "code"],
    ["EAI_AGAIN", "code"],
    ["UND_ERR_CONNECT_TIMEOUT", "name"],
    ["UND_ERR_HEADERS_TIMEOUT", "code"],
    ["UND_ERR_BODY_TIMEOUT", "code"],
    ["UND_ERR_SOCKET", "code"],
  ];

  for (const [signal, field] of retrySignals) {
    const calls = [];
    const sleeps = [];
    const transportError = new Error(`transport-${signal}-secret`);
    transportError[field] = signal;
    const middleError = new Error(`middle-${signal}-secret`, {
      cause: transportError,
    });
    const fetchError = new TypeError(`fetch-${signal}-secret`, {
      cause: middleError,
    });
    assert.equal(
      Object.getOwnPropertyDescriptor(fetchError, "cause").enumerable,
      false,
    );
    const client = createMetaClient({
      graphBase: GRAPH_BASE,
      token: TOKEN,
      fetchImpl: sequenceFetch(
        [
          () => {
            throw fetchError;
          },
          jsonResponse({ id: `success-after-${signal}` }),
        ],
        calls,
      ),
      sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
      randomImpl: () => 0,
    });

    assert.deepEqual(await client.get("/me"), {
      id: `success-after-${signal}`,
    });
    assert.equal(calls.length, 2);
    assert.deepEqual(sleeps, [250]);
  }

  const calls = [];
  const sleeps = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        () => {
          const socketError = new Error("socket nested-secret");
          socketError.code = "ECONNRESET";
          throw new TypeError("fetch failed with nested-secret", {
            cause: socketError,
          });
        },
        () => {
          const error = new Error("timed out with second-secret");
          error.code = "ETIMEDOUT";
          throw error;
        },
        () => {
          const socketError = new Error("final reset with third-secret");
          socketError.code = "ECONNRESET";
          throw new TypeError("final fetch wrapper with fourth-secret", {
            cause: socketError,
          });
        },
        jsonResponse({ id: "fourth-attempt-must-not-run" }),
      ],
      calls,
    ),
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(
    () => client.get("/me"),
    (error) => {
      assert.equal(error.code, "ECONNRESET");
      assert.doesNotMatch(
        JSON.stringify(error),
        /nested-secret|second-secret|third-secret|fourth-secret/,
      );
      return true;
    },
  );
  assert.equal(calls.length, 3);
  assert.deepEqual(sleeps, [250, 500]);
});

test("GET retries transient response body stream read failures", async () => {
  const retryCodes = [
    "UND_ERR_SOCKET",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
  ];

  for (const code of retryCodes) {
    const calls = [];
    const sleeps = [];
    const streamError = new Error(`reader-${code}-secret`);
    streamError.code = code;
    const readerError = new Error(`reader-wrapper-${code}-secret`, {
      cause: streamError,
    });
    const unreadableResponse = {
      status: 200,
      statusText: "OK",
      async text() {
        throw readerError;
      },
    };
    const client = createMetaClient({
      graphBase: GRAPH_BASE,
      token: TOKEN,
      fetchImpl: sequenceFetch(
        [
          unreadableResponse,
          jsonResponse({ id: `success-after-${code}` }),
        ],
        calls,
      ),
      sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
      randomImpl: () => 0,
    });

    assert.deepEqual(await client.get("/me"), {
      id: `success-after-${code}`,
    });
    assert.equal(calls.length, 2);
    assert.deepEqual(sleeps, [250]);
  }
});

test("GET does not retry caller cancellation even with a retryable code", async () => {
  let calls = 0;
  const sleeps = [];
  const abortError = new Error("caller-cancel-secret");
  abortError.name = "AbortError";
  abortError.code = "ECONNRESET";
  const fetchError = new TypeError("fetch-wrapper-secret", {
    cause: abortError,
  });
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () => {
      calls += 1;
      throw fetchError;
    },
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(
    () => client.get("/me"),
    (error) => {
      assert.equal(error.type, "AbortError");
      assert.equal(error.code, "ABORT_ERR");
      assert.doesNotMatch(
        JSON.stringify(error),
        /caller-cancel-secret|fetch-wrapper-secret/,
      );
      return true;
    },
  );
  assert.equal(calls, 1);
  assert.deepEqual(sleeps, []);
});

test("POST does not retry transient response body stream read failures", async () => {
  const retryCodes = [
    "ETIMEDOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
  ];

  for (const code of retryCodes) {
    let calls = 0;
    const sleeps = [];
    const timeoutError = new Error(`post-reader-${code}-secret`);
    timeoutError.code = code;
    const unreadableResponse = {
      status: 200,
      statusText: "OK",
      async text() {
        throw new Error(`post-reader-wrapper-${code}-secret`, {
          cause: timeoutError,
        });
      },
    };
    const client = createMetaClient({
      graphBase: GRAPH_BASE,
      token: TOKEN,
      fetchImpl: async () => {
        calls += 1;
        return unreadableResponse;
      },
      sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
      randomImpl: () => 0,
    });

    await assert.rejects(
      () => client.post("/act_123/campaigns"),
      (error) => {
        assert.equal(error.code, code);
        assert.doesNotMatch(
          JSON.stringify(error),
          new RegExp(
            `post-reader-${code}-secret|post-reader-wrapper-${code}-secret`,
          ),
        );
        return true;
      },
    );
    assert.equal(calls, 1);
    assert.deepEqual(sleeps, []);
  }
});

test("POST does not retry eligible transport failures", async () => {
  let calls = 0;
  const sleeps = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () => {
      calls += 1;
      const error = new Error("post-network-secret");
      error.code = "ETIMEDOUT";
      throw error;
    },
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(
    () => client.post("/act_123/campaigns"),
    (error) => {
      assert.equal(error.code, "ETIMEDOUT");
      assert.doesNotMatch(JSON.stringify(error), /post-network-secret/);
      return true;
    },
  );
  assert.equal(calls, 1);
  assert.deepEqual(sleeps, []);
});

test("GET retries Meta errors explicitly marked transient", async () => {
  const calls = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        jsonResponse(
          {
            error: {
              message: "Temporary Meta failure",
              type: "OAuthException",
              code: 2,
              is_transient: true,
            },
          },
          400,
        ),
        jsonResponse({ id: "1201" }),
      ],
      calls,
    ),
    sleepImpl: async () => {},
    randomImpl: () => 0,
  });

  assert.deepEqual(await client.get("/me"), { id: "1201" });
  assert.equal(calls.length, 2);
});

test("GET does not retry ordinary client errors", async () => {
  const calls = [];
  const sleeps = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        jsonResponse(
          {
            error: {
              message: "Unsupported request",
              type: "GraphMethodException",
              code: 100,
              is_transient: false,
            },
          },
          400,
        ),
        jsonResponse({ id: "must-not-run" }),
      ],
      calls,
    ),
    sleepImpl: async (milliseconds) => sleeps.push(milliseconds),
    randomImpl: () => 0,
  });

  await assert.rejects(
    () => client.get("/me"),
    (error) => {
      assert.equal(error.status, 400);
      assert.equal(error.code, 100);
      assert.equal(error.type, "GraphMethodException");
      return true;
    },
  );
  assert.equal(calls.length, 1);
  assert.deepEqual(sleeps, []);
});

test("Meta errors identify requests by pathname without serialized params", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      jsonResponse(
        {
          error: {
            message: "Unsupported request",
            type: "OAuthException",
            code: 100,
          },
        },
        400,
      ),
  });

  await assert.rejects(
    () =>
      client.get("/me", {
        password: "param-password",
        email: "param-person@example.test",
        signed_request: "param-signed-value",
      }),
    (error) => {
      assert.ok(error instanceof MetaApiError);
      assert.equal(error.details.method, "GET");
      assert.equal(error.details.path, "/v26.0/me");
      assert.equal("url" in error, false);
      for (const secret of [
        "param-password",
        "param-person",
        "param-signed-value",
        TOKEN,
      ]) {
        assert.doesNotMatch(JSON.stringify(error), new RegExp(secret));
      }
      return true;
    },
  );
});

test("Meta errors omit request and arbitrary response body fields", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      jsonResponse(
        {
          error: {
            message: "Invalid campaign request",
            type: "OAuthException",
            code: 100,
            error_data: {
              password: "response-password",
              email: "response-person@example.test",
              signed_request: "response-signed-value",
            },
            error_user_title: "Account response-person@example.test",
          },
          password: "top-level-password",
          email: "top-level-person@example.test",
          signed_request: "top-level-signed-value",
        },
        400,
      ),
  });

  await assert.rejects(
    () =>
      client.post("/act_123/campaigns", {
        name: "Campaign",
        password: "request-password",
        email: "request-person@example.test",
        signed_request: "request-signed-value",
      }),
    (error) => {
      assert.equal("body" in error, false);
      const serialized = JSON.stringify(error);
      for (const secret of [
        "request-password",
        "request-person",
        "request-signed-value",
        "response-password",
        "response-person",
        "response-signed-value",
        "top-level-password",
        "top-level-person",
        "top-level-signed-value",
      ]) {
        assert.doesNotMatch(serialized, new RegExp(secret));
      }
      return true;
    },
  );
});

test("Meta errors omit headers and retain only allowlisted diagnostics", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          error: {
            message:
              "Invalid Bearer response-token at " +
              "https://graph.example.test/me?access_token=response-token",
            type: "OAuthException",
            code: 190,
            error_subcode: 463,
            is_transient: false,
            fbtrace_id: "trace-allowed-123",
            password: "body-password",
          },
        }),
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer header-authorization-secret",
            "set-cookie": "session=header-cookie-secret; HttpOnly",
          },
        },
      ),
  });

  await assert.rejects(
    () => client.get("/me"),
    (error) => {
      assert.equal("headers" in error, false);
      assert.equal("body" in error, false);
      assert.equal("url" in error, false);
      assert.deepEqual(JSON.parse(JSON.stringify(error)), {
        name: "MetaApiError",
        message:
          "Invalid Bearer [REDACTED] at " +
          "https://graph.example.test/me?access_token=%5BREDACTED%5D",
        status: 401,
        statusText: "Unauthorized",
        code: 190,
        type: "OAuthException",
        details: {
          error_subcode: 463,
          is_transient: false,
          fbtrace_id: "trace-allowed-123",
          method: "GET",
          path: "/v26.0/me",
        },
      });
      const serialized = JSON.stringify(error);
      assert.doesNotMatch(serialized, /body-password/);
      assert.doesNotMatch(serialized, /header-authorization-secret/);
      assert.doesNotMatch(serialized, /header-cookie-secret/);
      assert.deepEqual(safeError(error), {
        name: "MetaApiError",
        message:
          "Invalid Bearer [REDACTED] at " +
          "https://graph.example.test/me?access_token=%5BREDACTED%5D",
        status: 401,
        statusText: "Unauthorized",
        code: 190,
        type: "OAuthException",
        details: {
          error_subcode: 463,
          is_transient: false,
          fbtrace_id: "trace-allowed-123",
          method: "GET",
          path: "/v26.0/me",
        },
      });
      return true;
    },
  );
});

test("non-JSON and malformed responses fail with sanitized MetaApiError values", async () => {
  const nonJsonClient = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      new Response(`gateway leaked ${TOKEN}`, {
        status: 502,
        headers: {
          "content-type": "text/plain",
          "x-debug": TOKEN,
        },
      }),
    sleepImpl: async () => {},
    randomImpl: () => 0,
  });

  await assert.rejects(
    () => nonJsonClient.post("/me"),
    (error) => {
      assert.ok(error instanceof MetaApiError);
      assert.equal(error.status, 502);
      assert.equal(error.code, "NON_JSON_RESPONSE");
      assert.doesNotMatch(JSON.stringify(error), new RegExp(TOKEN));
      return true;
    },
  );

  const malformedClient = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () => null,
  });

  await assert.rejects(
    () => malformedClient.get("/me"),
    (error) => {
      assert.ok(error instanceof MetaApiError);
      assert.equal(error.status, null);
      assert.equal(error.code, "MALFORMED_RESPONSE");
      assert.doesNotMatch(JSON.stringify(error), new RegExp(TOKEN));
      return true;
    },
  );
});

test("readAfterWrite projects objects while comparing arrays exactly", async () => {
  const calls = [];
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: sequenceFetch(
      [
        jsonResponse({
          id: "1201",
          status: "PAUSED",
          daily_budget: "5000",
          configured_status: "PAUSED",
          targeting: {
            age_min: "21",
            age_max: "65",
            geo_locations: {
              countries: ["VN", "US"],
              location_types: ["home", "recent"],
            },
            targeting_automation: {
              advantage_audience: 1,
            },
          },
          placements: ["instagram", "facebook"],
          flexible_spec: [
            {
              interests: [{ id: "100", name: "Travel" }],
              read_only_description: "Meta normalized",
            },
          ],
        }),
      ],
      calls,
    ),
  });

  const result = await client.readAfterWrite(
    "/1201",
    [
      "status",
      "daily_budget",
      "configured_status",
      "targeting",
      "placements",
      "flexible_spec",
    ],
    {
      status: "PAUSED",
      daily_budget: 5000,
      configured_status: "PAUSED",
      targeting: {
        geo_locations: {
          countries: ["VN", "US"],
        },
        age_min: 21,
      },
      placements: ["instagram", "facebook"],
      flexible_spec: [
        {
          interests: [{ id: 100 }],
        },
      ],
    },
  );

  assert.equal(result.matches, true);
  assert.equal(result.actual.status, "PAUSED");
  assert.equal(result.actual.targeting.age_min, "21");
  assert.deepEqual(result.mismatches, []);
  const url = new URL(calls[0].url);
  assert.equal(
    url.searchParams.get("fields"),
    "status,daily_budget,configured_status,targeting,placements,flexible_spec",
  );
});

test("readAfterWrite reports precise nested mismatch paths", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      jsonResponse({
        id: "1201",
        status: "ACTIVE",
        targeting: {
          age_min: "25",
          geo_locations: { countries: ["VN"] },
        },
        flexible_spec: [
          {
            interests: [{ id: "100", name: "Travel" }],
          },
        ],
      }),
  });
  const expectedTargeting = {
    age_min: 21,
    geo_locations: { countries: ["VN", "US"] },
  };
  const expectedFlexibleSpec = [
    {
      interests: [{ id: 100 }, { id: 200 }],
    },
  ];

  const result = await client.readAfterWrite(
    "/1201",
    ["status", "daily_budget", "targeting", "flexible_spec"],
    {
      status: "PAUSED",
      daily_budget: 5000,
      targeting: expectedTargeting,
      flexible_spec: expectedFlexibleSpec,
    },
  );

  assert.equal(result.matches, false);
  assert.deepEqual(result.mismatches, [
    {
      field: "status",
      expected: "PAUSED",
      actual: "ACTIVE",
      reason: "mismatch",
    },
    {
      field: "daily_budget",
      expected: 5000,
      actual: undefined,
      reason: "missing",
    },
    {
      field: "targeting.age_min",
      expected: 21,
      actual: "25",
      reason: "mismatch",
    },
    {
      field: "targeting.geo_locations.countries[1]",
      expected: "US",
      actual: undefined,
      reason: "missing",
    },
    {
      field: "flexible_spec[0].interests[1]",
      expected: { id: 200 },
      actual: undefined,
      reason: "missing",
    },
  ]);
});

test("readAfterWrite reports extra array elements", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      jsonResponse({
        id: "1201",
        placements: ["instagram", "facebook", "audience_network"],
      }),
  });

  const result = await client.readAfterWrite(
    "/1201",
    ["placements"],
    {
      placements: ["instagram", "facebook"],
    },
  );

  assert.equal(result.matches, false);
  assert.deepEqual(result.mismatches, [
    {
      field: "placements[2]",
      expected: undefined,
      actual: "audience_network",
      reason: "unexpected",
    },
  ]);
});

test("readAfterWrite reports reordered carousel assets by index", async () => {
  const client = createMetaClient({
    graphBase: GRAPH_BASE,
    token: TOKEN,
    fetchImpl: async () =>
      jsonResponse({
        id: "1201",
        carousel_assets: [
          {
            id: "asset-2",
            name: "Second",
            read_only_status: "ACTIVE",
          },
          {
            id: "asset-1",
            name: "First",
          },
        ],
      }),
  });

  const result = await client.readAfterWrite(
    "/1201",
    ["carousel_assets"],
    {
      carousel_assets: [{ id: "asset-1" }, { id: "asset-2" }],
    },
  );

  assert.equal(result.matches, false);
  assert.deepEqual(result.mismatches, [
    {
      field: "carousel_assets[0].id",
      expected: "asset-1",
      actual: "asset-2",
      reason: "mismatch",
    },
    {
      field: "carousel_assets[1].id",
      expected: "asset-2",
      actual: "asset-1",
      reason: "mismatch",
    },
  ]);
});
