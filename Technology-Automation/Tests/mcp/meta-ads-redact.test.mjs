import test from "node:test";
import assert from "node:assert/strict";

import {
  redactSecrets,
  safeError,
} from "../../MCP/meta-ads/redact.mjs";

test("redacts nested secret keys while preserving IDs and metrics", () => {
  const input = {
    id: "23851234567890123",
    spend: 42.75,
    nested: {
      access_token: "token-value",
      CLIENT_SECRET: "client-value",
      appsecret_proof: "proof-value",
      impressions: 1200,
    },
  };

  const redacted = redactSecrets(input);

  assert.deepEqual(redacted, {
    id: "23851234567890123",
    spend: 42.75,
    nested: {
      access_token: "[REDACTED]",
      CLIENT_SECRET: "[REDACTED]",
      appsecret_proof: "[REDACTED]",
      impressions: 1200,
    },
  });
  assert.equal(input.nested.access_token, "token-value");
});

test("redacts common credential key variants without hiding business fields", () => {
  const redacted = redactSecrets({
    token: "token-value",
    refresh_token: "refresh-value",
    api_token: "api-token-value",
    api_key: "api-key-value",
    secret: "secret-value",
    api_secret: "api-secret-value",
    client_secret: "client-secret-value",
    proof: "proof-value",
    appsecret_proof: "app-proof-value",
    authorization: "Basic auth-value",
    proxy_authorization: "Basic proxy-value",
    refreshToken: "camel-refresh-value",
    "api-key": "hyphen-api-key-value",
    spend: 42.75,
    id: "23851234567890123",
    access_type: "offline",
  });

  for (const key of [
    "token",
    "refresh_token",
    "api_token",
    "api_key",
    "secret",
    "api_secret",
    "client_secret",
    "proof",
    "appsecret_proof",
    "authorization",
    "proxy_authorization",
    "refreshToken",
    "api-key",
  ]) {
    assert.equal(redacted[key], "[REDACTED]");
  }
  assert.equal(redacted.spend, 42.75);
  assert.equal(redacted.id, "23851234567890123");
  assert.equal(redacted.access_type, "offline");
});

test("redacts passwords, cookies, and private key variants", () => {
  const redacted = redactSecrets({
    password: "password-value",
    databasePassword: "database-password-value",
    passphrase: "passphrase-value",
    signing_passphrase: "signing-passphrase-value",
    cookie: "cookie-value",
    session_cookie: "session-cookie-value",
    "set-cookie": "set-cookie-value",
    responseSetCookie: "response-set-cookie-value",
    private_key: "private-key-value",
    tlsPrivateKey: "tls-private-key-value",
    secret_key: "secret-key-value",
    aws_secret_key: "aws-secret-key-value",
    password_policy: "rotate-quarterly",
    cookie_count: 4,
    private_key_rotation_days: 30,
    secret_key_label: "reporting",
    campaign_key: "summer-2026",
  });

  for (const key of [
    "password",
    "databasePassword",
    "passphrase",
    "signing_passphrase",
    "cookie",
    "session_cookie",
    "set-cookie",
    "responseSetCookie",
    "private_key",
    "tlsPrivateKey",
    "secret_key",
    "aws_secret_key",
  ]) {
    assert.equal(redacted[key], "[REDACTED]", key);
  }
  assert.equal(redacted.password_policy, "rotate-quarterly");
  assert.equal(redacted.cookie_count, 4);
  assert.equal(redacted.private_key_rotation_days, 30);
  assert.equal(redacted.secret_key_label, "reporting");
  assert.equal(redacted.campaign_key, "summer-2026");
});

test("redacts prefixed normalized credential keys without partial matches", () => {
  const redacted = redactSecrets({
    META_ADS_ACCESS_TOKEN: "meta-token",
    facebook_access_token: "facebook-token",
    internalApiKey: "internal-key",
    request_secret: "request-secret",
    campaign_id: "1201",
    total_spend: 45,
    content_access_type: "offline",
    token_count: 3,
  });

  assert.equal(redacted.META_ADS_ACCESS_TOKEN, "[REDACTED]");
  assert.equal(redacted.facebook_access_token, "[REDACTED]");
  assert.equal(redacted.internalApiKey, "[REDACTED]");
  assert.equal(redacted.request_secret, "[REDACTED]");
  assert.equal(redacted.campaign_id, "1201");
  assert.equal(redacted.total_spend, 45);
  assert.equal(redacted.content_access_type, "offline");
  assert.equal(redacted.token_count, 3);
});

test("redacts authorization fields and bearer strings", () => {
  const redacted = redactSecrets({
    Authorization: "Bearer header-secret",
    message: "Request failed with Bearer message-secret",
    ordinary: "bearer",
  });

  assert.deepEqual(redacted, {
    Authorization: "[REDACTED]",
    message: "Request failed with Bearer [REDACTED]",
    ordinary: "bearer",
  });
});

test("preserves trailing punctuation after redacted bearer tokens", () => {
  assert.equal(
    redactSecrets("Meta request failed (Bearer bearer-secret)."),
    "Meta request failed (Bearer [REDACTED]).",
  );
});

test("redacts colon-style credentials and prefixed header variants", () => {
  const input = [
    "Request failed",
    "Cookie: cookie-secret",
    "Set-Cookie: set-cookie-secret; HttpOnly",
    "databasePassword: password-secret",
    "signing_passphrase: passphrase-secret",
    "tls private key: private-key-secret",
    "aws secret key: secret-key-secret",
    "Proxy-Authorization: Basic authorization-secret",
  ].join("\n");

  assert.equal(
    redactSecrets(input),
    [
      "Request failed",
      "Cookie: [REDACTED]",
      "Set-Cookie: [REDACTED]",
      "databasePassword: [REDACTED]",
      "signing_passphrase: [REDACTED]",
      "tls private key: [REDACTED]",
      "aws secret key: [REDACTED]",
      "Proxy-Authorization: [REDACTED]",
    ].join("\n"),
  );
});

test("colon redaction preserves ordinary business prose", () => {
  const prose = [
    "Password policy: rotate quarterly",
    "Cookie count: 4",
    "Set cookie preference: optional",
    "Private key rotation: 30 days",
    "Secret key label: reporting",
    "Authorization status: unavailable",
  ].join("\n");

  assert.equal(redactSecrets(prose), prose);
});

test("redacts sensitive query parameters in paging URLs", () => {
  const redacted = redactSecrets({
    paging: {
      next:
        "https://graph.facebook.com/v23.0/act_123/campaigns" +
        "?after=cursor-123&limit=25&access_token=url-token" +
        "&client_secret=url-secret&appsecret_proof=url-proof",
    },
  });

  const next = new URL(redacted.paging.next);
  assert.equal(next.searchParams.get("after"), "cursor-123");
  assert.equal(next.searchParams.get("limit"), "25");
  assert.equal(next.searchParams.get("access_token"), "[REDACTED]");
  assert.equal(next.searchParams.get("client_secret"), "[REDACTED]");
  assert.equal(next.searchParams.get("appsecret_proof"), "[REDACTED]");
  assert.equal(next.pathname, "/v23.0/act_123/campaigns");
});

test("redacts expanded sensitive query variants in absolute URLs", () => {
  const redacted = redactSecrets(
    "https://graph.facebook.com/v23.0/me" +
      "?token=token-value&refresh_token=refresh-value" +
      "&api_key=key-value&proof=proof-value" +
      "&proxy_authorization=proxy-value" +
      "&id=123&spend=45&access_type=offline",
  );

  const url = new URL(redacted);
  for (const key of [
    "token",
    "refresh_token",
    "api_key",
    "proof",
    "proxy_authorization",
  ]) {
    assert.equal(url.searchParams.get(key), "[REDACTED]");
  }
  assert.equal(url.searchParams.get("id"), "123");
  assert.equal(url.searchParams.get("spend"), "45");
  assert.equal(url.searchParams.get("access_type"), "offline");
});

test("redacts sensitive query variants in relative URLs", () => {
  assert.equal(
    redactSecrets(
      "/v23.0/me?after=cursor&api_token=relative-secret" +
        "&access_type=offline#results",
    ),
    "/v23.0/me?after=cursor&api_token=%5BREDACTED%5D" +
      "&access_type=offline#results",
  );
});

test("redacts a credential parameter at the start of a form body", () => {
  assert.equal(
    redactSecrets(
      "access_token=form-secret&scope=ads_read&access_type=offline",
    ),
    "access_token=%5BREDACTED%5D&scope=ads_read&access_type=offline",
  );
});

test("redacts embedded form credentials at safe text boundaries", () => {
  const cases = [
    [
      "request body access_token=space-secret&scope=ads_read",
      "request body access_token=%5BREDACTED%5D&scope=ads_read",
    ],
    [
      "request body:access_token=colon-secret&scope=ads_read",
      "request body:access_token=%5BREDACTED%5D&scope=ads_read",
    ],
    [
      "request_body=access_token=equals-secret&scope=ads_read",
      "request_body=access_token=%5BREDACTED%5D&scope=ads_read",
    ],
  ];

  for (const [input, expected] of cases) {
    assert.equal(redactSecrets(input), expected);
  }
  assert.equal(
    redactSecrets("request body: access_type=offline&scope=ads_read"),
    "request body: access_type=offline&scope=ads_read",
  );
});

test("redacts prefixed credential parameters after URL fragments", () => {
  assert.equal(
    redactSecrets(
      "https://example.test/callback" +
        "#facebook_access_token=fragment-secret&state=confirmed",
    ),
    "https://example.test/callback" +
      "#facebook_access_token=%5BREDACTED%5D&state=confirmed",
  );
});

test("redacts secrets inside arrays", () => {
  const redacted = redactSecrets([
    { campaign_id: "1201", access_token: "array-token" },
    [
      "Bearer nested-array-token",
      { client_secret: "nested-array-secret", clicks: 9 },
    ],
  ]);

  assert.deepEqual(redacted, [
    { campaign_id: "1201", access_token: "[REDACTED]" },
    [
      "Bearer [REDACTED]",
      { client_secret: "[REDACTED]", clicks: 9 },
    ],
  ]);
});

test("redactSecrets handles cyclic objects and arrays", () => {
  const object = {
    id: "1201",
    access_token: "object-secret",
  };
  const array = [{ api_key: "array-secret", spend: 20 }];
  object.self = object;
  object.items = array;
  array.push(object, array);

  assert.deepEqual(redactSecrets(object), {
    id: "1201",
    access_token: "[REDACTED]",
    self: "[CIRCULAR]",
    items: [
      { api_key: "[REDACTED]", spend: 20 },
      "[CIRCULAR]",
      "[CIRCULAR]",
    ],
  });
});

test("redactSecrets marks throwing enumerable getters as unreadable", () => {
  const nested = { id: "1201" };
  Object.defineProperty(nested, "diagnostic", {
    enumerable: true,
    get() {
      throw new Error("diagnostic getter failed");
    },
  });

  const input = { nested };
  Object.defineProperty(input, "unstable", {
    enumerable: true,
    get() {
      throw new Error("top-level getter failed");
    },
  });

  assert.deepEqual(redactSecrets(input), {
    nested: {
      id: "1201",
      diagnostic: "[UNREADABLE]",
    },
    unstable: "[UNREADABLE]",
  });
});

test("safeError returns sanitized error details without a stack", () => {
  const error = new Error(
    "Meta request failed: Authorization: Bearer message-token",
  );
  error.code = "META_REQUEST_FAILED";
  error.details = {
    account_id: "act_123456789",
    access_token: "detail-token",
    paging_url:
      "https://graph.facebook.com/v23.0/me?after=cursor" +
      "&access_token=paging-token",
  };

  const safe = safeError(error);

  assert.deepEqual(safe, {
    name: "Error",
    message: "Meta request failed: Authorization: [REDACTED]",
    code: "META_REQUEST_FAILED",
    details: {
      account_id: "act_123456789",
      access_token: "[REDACTED]",
      paging_url:
        "https://graph.facebook.com/v23.0/me?after=cursor" +
        "&access_token=%5BREDACTED%5D",
    },
  });
  assert.equal("stack" in safe, false);
  assert.doesNotMatch(JSON.stringify(safe), /message-token|detail-token|paging-token/);
});

test("safeError redacts an embedded URL while preserving surrounding text", () => {
  const error = new Error(
    "Meta failed at https://graph.facebook.com/v23.0/me" +
      "?api_secret=embedded-secret&after=cursor and retry later",
  );

  assert.deepEqual(safeError(error), {
    name: "Error",
    message:
      "Meta failed at https://graph.facebook.com/v23.0/me" +
      "?api_secret=%5BREDACTED%5D&after=cursor and retry later",
  });
});

test("safeError handles cyclic custom error details", () => {
  const details = {
    id: "1201",
    refresh_token: "error-secret",
  };
  details.self = details;

  const error = new Error("Meta request failed");
  error.details = details;

  assert.deepEqual(safeError(error), {
    name: "Error",
    message: "Meta request failed",
    details: {
      id: "1201",
      refresh_token: "[REDACTED]",
      self: "[CIRCULAR]",
    },
  });
});

test("safeError preserves the original error around throwing getters", () => {
  const details = { id: "1201" };
  Object.defineProperty(details, "diagnostic", {
    enumerable: true,
    get() {
      throw new Error("nested getter failed");
    },
  });

  const error = new Error("Original Meta request failure");
  error.code = "META_REQUEST_FAILED";
  error.details = details;
  Object.defineProperty(error, "debugContext", {
    enumerable: true,
    get() {
      throw new Error("error getter failed");
    },
  });

  assert.deepEqual(safeError(error), {
    name: "Error",
    message: "Original Meta request failure",
    code: "META_REQUEST_FAILED",
    details: {
      id: "1201",
      diagnostic: "[UNREADABLE]",
    },
    debugContext: "[UNREADABLE]",
  });
});

test("safeError sanitizes non-Error values", () => {
  assert.deepEqual(
    safeError({
      message: "Bearer object-token",
      appsecret_proof: "object-proof",
      status: 400,
    }),
    {
      message: "Bearer [REDACTED]",
      appsecret_proof: "[REDACTED]",
      status: 400,
    },
  );
});
