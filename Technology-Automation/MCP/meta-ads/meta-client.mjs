import { isDeepStrictEqual } from "node:util";

import { redactSecrets, safeError } from "./redact.mjs";

const REDACTED = "[REDACTED]";
const MAX_GET_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 250;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRYABLE_TRANSPORT_SIGNALS = new Set([
  "EAI_AGAIN",
  "ECONNRESET",
  "ETIMEDOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_SOCKET",
]);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const MISSING = Symbol("missing");

function defaultSleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function secretVariants(token) {
  if (typeof token !== "string" || token === "") {
    return [];
  }

  const formEncoded = new URLSearchParams({ value: token })
    .toString()
    .slice("value=".length);
  return [...new Set([token, encodeURIComponent(token), formEncoded])].filter(
    Boolean,
  );
}

function replaceKnownSecret(value, variants) {
  if (typeof value === "string") {
    return variants.reduce(
      (sanitized, variant) => sanitized.split(variant).join(REDACTED),
      value,
    );
  }

  if (Array.isArray(value)) {
    return value.map((entry) => replaceKnownSecret(entry, variants));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        replaceKnownSecret(entry, variants),
      ]),
    );
  }

  return value;
}

function sanitize(value, token) {
  return replaceKnownSecret(
    redactSecrets(safeError(value)),
    secretVariants(token),
  );
}

function allowedString(value, token) {
  return typeof value === "string" ? sanitize(value, token) : null;
}

function allowedCode(value, token) {
  return typeof value === "string" || typeof value === "number"
    ? sanitize(value, token)
    : null;
}

function optionalDiagnosticEntries(entries) {
  return Object.fromEntries(
    entries.filter(([, value]) => value !== null && value !== undefined),
  );
}

export class MetaApiError extends Error {
  constructor(
    {
      message,
      status = null,
      statusText = null,
      code = null,
      type = null,
      errorSubcode = null,
      isTransient = null,
      fbtraceId = null,
      method = null,
      path = null,
    },
    token = "",
  ) {
    super(sanitize(String(message), token));
    this.name = "MetaApiError";
    this.status = typeof status === "number" ? status : null;
    this.statusText = allowedString(statusText, token);
    this.code = allowedCode(code, token);
    this.type = allowedString(type, token);
    this.details = optionalDiagnosticEntries([
      ["error_subcode", allowedCode(errorSubcode, token)],
      [
        "is_transient",
        typeof isTransient === "boolean" ? isTransient : null,
      ],
      ["fbtrace_id", allowedString(fbtraceId, token)],
      ["method", allowedString(method, token)],
      ["path", allowedString(path, token)],
    ]);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      code: this.code,
      type: this.type,
      details: this.details,
    };
  }
}

function clientInputError({ message, code, method, path }, token) {
  return new MetaApiError(
    {
      message,
      code,
      type: "ClientInputError",
      method,
      path,
    },
    token,
  );
}

function malformedResponseError(context, token) {
  return new MetaApiError(
    {
      message: "Meta API returned a malformed response",
      code: "MALFORMED_RESPONSE",
      type: "ClientResponseError",
      method: context.method,
      path: context.path,
    },
    token,
  );
}

function rawDataProperty(value, key) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return undefined;
  }

  let current = value;
  for (let depth = 0; current && depth < 8; depth += 1) {
    let descriptor;
    try {
      descriptor = Object.getOwnPropertyDescriptor(current, key);
    } catch {
      return undefined;
    }

    if (descriptor) {
      return Object.hasOwn(descriptor, "value")
        ? descriptor.value
        : undefined;
    }

    try {
      current = Object.getPrototypeOf(current);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function classifyRawTransportError(error, fallbackCode, fallbackType) {
  const seen = new Set();
  let current = error;
  let retrySignal = null;

  for (let depth = 0; current && depth < 8; depth += 1) {
    if (
      typeof current !== "object" &&
      typeof current !== "function"
    ) {
      break;
    }
    if (seen.has(current)) {
      break;
    }
    seen.add(current);

    const name = rawDataProperty(current, "name");
    const code = rawDataProperty(current, "code");
    if (name === "AbortError" || code === "ABORT_ERR") {
      return {
        code: "ABORT_ERR",
        type: "AbortError",
      };
    }

    if (!retrySignal) {
      retrySignal = [code, name].find(
        (value) =>
          typeof value === "string" &&
          RETRYABLE_TRANSPORT_SIGNALS.has(value),
      );
    }

    current = rawDataProperty(current, "cause");
  }

  if (retrySignal) {
    return {
      code: retrySignal,
      type: "TransportError",
    };
  }

  return {
    code: fallbackCode,
    type: fallbackType,
  };
}

function validateResponse(response, context, token) {
  if (
    !response ||
    typeof response !== "object" ||
    typeof response.status !== "number" ||
    typeof response.text !== "function"
  ) {
    throw malformedResponseError(context, token);
  }
}

function metaErrorFromBody(response, body, context, token) {
  const errorBody =
    body && typeof body === "object" && body.error
      ? body.error
      : null;
  const errorObject =
    errorBody && typeof errorBody === "object" ? errorBody : {};

  return new MetaApiError(
    {
      message:
        typeof errorObject.message === "string"
          ? errorObject.message
          : `Meta API request failed with status ${response.status}`,
      status: response.status,
      statusText: response.statusText,
      code: errorObject.code ?? response.status,
      type: errorObject.type ?? "MetaApiError",
      errorSubcode: errorObject.error_subcode,
      isTransient: errorObject.is_transient,
      fbtraceId: errorObject.fbtrace_id,
      method: context.method,
      path: context.path,
    },
    token,
  );
}

async function parseResponse(response, context, token) {
  validateResponse(response, context, token);

  let text;
  try {
    text = await response.text();
  } catch (error) {
    const classification = classifyRawTransportError(
      error,
      "RESPONSE_READ_FAILED",
      "ClientResponseError",
    );
    throw new MetaApiError(
      {
        message: "Meta API response body could not be read",
        status: response.status,
        statusText: response.statusText,
        code: classification.code,
        type: classification.type,
        method: context.method,
        path: context.path,
      },
      token,
    );
  }

  let body = null;
  if (text !== "") {
    try {
      body = JSON.parse(text);
    } catch {
      throw new MetaApiError(
        {
          message: "Meta API returned a non-JSON response",
          status: response.status,
          statusText: response.statusText,
          code: "NON_JSON_RESPONSE",
          type: "ClientResponseError",
          method: context.method,
          path: context.path,
        },
        token,
      );
    }
  }

  const succeeded = response.status >= 200 && response.status < 300;
  const hasMetaError =
    body &&
    typeof body === "object" &&
    Object.hasOwn(body, "error");

  if (!succeeded || hasMetaError) {
    throw metaErrorFromBody(response, body, context, token);
  }

  return body;
}

function serializeParam(value) {
  if (typeof value === "bigint") {
    throw new TypeError("BigInt parameters are not supported");
  }

  if (value && typeof value === "object") {
    const serialized = JSON.stringify(value);
    if (typeof serialized !== "string") {
      throw new TypeError("Object parameter did not serialize to JSON");
    }
    return serialized;
  }

  return String(value);
}

function createWireParams(params, token) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    throw new TypeError("Meta parameters must be an object");
  }

  const wireParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key === "access_token" || value === undefined) {
      continue;
    }
    wireParams.append(key, serializeParam(value));
  }

  wireParams.set("access_token", token);
  return wireParams;
}

function invalidPathError(method, token) {
  return clientInputError(
    {
      message: "Meta Graph path must be a clean relative object path",
      code: "INVALID_PATH",
      method,
    },
    token,
  );
}

function validateGraphPath(path, method, token) {
  if (
    typeof path !== "string" ||
    path === "" ||
    path.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(path) ||
    path.includes("?") ||
    path.includes("#") ||
    path.includes("\\") ||
    CONTROL_CHARACTERS.test(path)
  ) {
    throw invalidPathError(method, token);
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const segments = normalizedPath.split("/");
  if (normalizedPath === "" || segments.some((segment) => segment === "")) {
    throw invalidPathError(method, token);
  }

  for (const segment of segments) {
    let decoded;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw invalidPathError(method, token);
    }

    if (
      decoded === "." ||
      decoded === ".." ||
      decoded.includes("/") ||
      decoded.includes("\\") ||
      decoded.includes("?") ||
      decoded.includes("#") ||
      CONTROL_CHARACTERS.test(decoded)
    ) {
      throw invalidPathError(method, token);
    }
  }

  return normalizedPath;
}

function buildUrl(graphBase, normalizedPath, method, token) {
  try {
    if (typeof graphBase !== "string") {
      throw new TypeError("Graph base must be a URL string");
    }

    const baseUrl = new URL(graphBase);
    if (baseUrl.search !== "" || baseUrl.hash !== "") {
      throw new TypeError("Graph base cannot contain a query or fragment");
    }
    baseUrl.pathname =
      `${baseUrl.pathname.replace(/\/+$/, "")}/${normalizedPath}`;
    return baseUrl;
  } catch {
    throw clientInputError(
      {
        message: "Meta Graph base URL is invalid",
        code: "URL_CONSTRUCTION_FAILED",
        method,
      },
      token,
    );
  }
}

function serializeWireParams(params, token, context) {
  try {
    return createWireParams(params, token);
  } catch {
    throw clientInputError(
      {
        message: "Meta request parameters could not be serialized",
        code: "PARAM_SERIALIZATION_FAILED",
        method: context.method,
        path: context.path,
      },
      token,
    );
  }
}

function shouldRetryGet(error) {
  if (!(error instanceof MetaApiError)) {
    return false;
  }

  if (error.type === "AbortError" || error.code === "ABORT_ERR") {
    return false;
  }

  return (
    RETRYABLE_STATUSES.has(error.status) ||
    error.details.is_transient === true ||
    RETRYABLE_TRANSPORT_SIGNALS.has(error.code)
  );
}

function retryDelay(attempt, randomImpl) {
  const exponentialDelay = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
  const randomValue = Math.min(1, Math.max(0, Number(randomImpl()) || 0));
  const jitter = Math.floor(exponentialDelay * 0.4 * randomValue);
  return exponentialDelay + jitter;
}

function normalizeMetaWireScalar(value) {
  if (
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return value;
}

function objectFieldPath(path, key) {
  return /^[a-z_$][a-z0-9_$]*$/i.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

function compareExpectedArray(expected, actual, path, mismatches) {
  if (!Array.isArray(actual)) {
    mismatches.push({
      field: path,
      expected,
      actual,
      reason: "mismatch",
    });
    return;
  }

  const sharedLength = Math.min(expected.length, actual.length);
  for (let index = 0; index < sharedLength; index += 1) {
    compareExpectedProjection(
      expected[index],
      actual[index],
      `${path}[${index}]`,
      mismatches,
    );
  }

  for (let index = sharedLength; index < expected.length; index += 1) {
    compareExpectedProjection(
      expected[index],
      MISSING,
      `${path}[${index}]`,
      mismatches,
    );
  }

  for (let index = sharedLength; index < actual.length; index += 1) {
    mismatches.push({
      field: `${path}[${index}]`,
      expected: undefined,
      actual: actual[index],
      reason: "unexpected",
    });
  }
}

function compareExpectedObject(expected, actual, path, mismatches) {
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) {
    mismatches.push({
      field: path,
      expected,
      actual,
      reason: "mismatch",
    });
    return;
  }

  for (const [key, expectedValue] of Object.entries(expected)) {
    compareExpectedProjection(
      expectedValue,
      Object.hasOwn(actual, key) ? actual[key] : MISSING,
      objectFieldPath(path, key),
      mismatches,
    );
  }
}

function compareExpectedProjection(expected, actual, path, mismatches) {
  if (actual === MISSING) {
    mismatches.push({
      field: path,
      expected,
      actual: undefined,
      reason: "missing",
    });
    return;
  }

  if (Array.isArray(expected)) {
    compareExpectedArray(expected, actual, path, mismatches);
    return;
  }

  if (expected && typeof expected === "object") {
    compareExpectedObject(expected, actual, path, mismatches);
    return;
  }

  if (
    !isDeepStrictEqual(
      normalizeMetaWireScalar(expected),
      normalizeMetaWireScalar(actual),
    )
  ) {
    mismatches.push({
      field: path,
      expected,
      actual,
      reason: "mismatch",
    });
  }
}

export function createMetaClient({
  graphBase,
  token,
  fetchImpl = fetch,
  sleepImpl = defaultSleep,
  randomImpl = Math.random,
}) {
  async function request(method, path, params = {}) {
    const context = { method };
    let url;
    let options;

    try {
      const normalizedPath = validateGraphPath(path, method, token);
      url = buildUrl(graphBase, normalizedPath, method, token);
      context.path = url.pathname;
      const wireParams = serializeWireParams(params, token, context);
      options = { method };

      if (method === "GET") {
        for (const [key, value] of wireParams) {
          url.searchParams.append(key, value);
        }
      } else {
        options.headers = {
          "content-type": "application/x-www-form-urlencoded",
        };
        options.body = wireParams.toString();
      }
    } catch (error) {
      if (error instanceof MetaApiError) {
        throw error;
      }

      throw clientInputError(
        {
          message: "Meta request could not be prepared",
          code: "REQUEST_PREPARATION_FAILED",
          method: context.method,
          path: context.path,
        },
        token,
      );
    }

    try {
      const response = await fetchImpl(url.toString(), options);
      return await parseResponse(response, context, token);
    } catch (error) {
      if (error instanceof MetaApiError) {
        throw error;
      }

      const classification = classifyRawTransportError(
        error,
        "FETCH_FAILED",
        "FetchError",
      );
      throw new MetaApiError(
        {
          message: "Meta API request failed before receiving a response",
          code: classification.code,
          type: classification.type,
          method: context.method,
          path: context.path,
        },
        token,
      );
    }
  }

  async function get(path, params = {}) {
    for (let attempt = 1; attempt <= MAX_GET_ATTEMPTS; attempt += 1) {
      try {
        return await request("GET", path, params);
      } catch (error) {
        if (attempt === MAX_GET_ATTEMPTS || !shouldRetryGet(error)) {
          throw error;
        }
        await sleepImpl(retryDelay(attempt, randomImpl));
      }
    }

    throw new Error("Unreachable Meta GET retry state");
  }

  async function post(path, params = {}) {
    return request("POST", path, params);
  }

  async function readAfterWrite(path, fields, expected) {
    const fieldList = Array.isArray(fields) ? fields.join(",") : String(fields);
    const actual = await get(path, { fields: fieldList });
    const mismatches = [];

    for (const [field, expectedValue] of Object.entries(expected)) {
      compareExpectedProjection(
        expectedValue,
        actual && typeof actual === "object" && Object.hasOwn(actual, field)
          ? actual[field]
          : MISSING,
        field,
        mismatches,
      );
    }

    return {
      matches: mismatches.length === 0,
      actual,
      mismatches,
    };
  }

  return {
    get,
    post,
    readAfterWrite,
  };
}
