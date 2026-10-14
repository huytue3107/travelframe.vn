const REDACTED = "[REDACTED]";
const CIRCULAR = "[CIRCULAR]";
const UNREADABLE = "[UNREADABLE]";
const SENSITIVE_KEYS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "api_token",
  "api_key",
  "secret",
  "api_secret",
  "client_secret",
  "password",
  "passphrase",
  "cookie",
  "set_cookie",
  "private_key",
  "secret_key",
  "proof",
  "appsecret_proof",
  "authorization",
  "proxy_authorization",
]);

function normalizeKey(key) {
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function isSensitiveKey(key) {
  let decodedKey = key;
  try {
    decodedKey = decodeURIComponent(key.replace(/\+/g, " "));
  } catch {
    // Invalid percent encoding cannot match a normalized credential name.
  }
  const normalizedKey = normalizeKey(decodedKey);
  return [...SENSITIVE_KEYS].some(
    (sensitiveKey) =>
      normalizedKey === sensitiveKey ||
      normalizedKey.endsWith(`_${sensitiveKey}`),
  );
}

function redactQueryParams(value) {
  const replacements = [];
  const keyPattern =
    /(^|(?<=[?&#:=\s]))([A-Za-z0-9_%+.-]+)=/g;

  for (const match of value.matchAll(keyPattern)) {
    const key = match[2];
    if (!isSensitiveKey(key)) {
      continue;
    }

    const valueStart = match.index + match[0].length;
    const remaining = value.slice(valueStart);
    const valueLength = remaining.search(/[&#\s<>"']/);
    const valueEnd =
      valueLength === -1 ? value.length : valueStart + valueLength;
    const queryValue = value.slice(valueStart, valueEnd);
    const trailingPunctuation =
      queryValue.match(/[),.;:!?}\]]+$/)?.[0] ?? "";
    replacements.push({
      start: valueStart,
      end: valueEnd,
      value: encodeURIComponent(REDACTED) + trailingPunctuation,
    });
  }

  return replacements.reduceRight(
    (redacted, replacement) =>
      redacted.slice(0, replacement.start) +
      replacement.value +
      redacted.slice(replacement.end),
    value,
  );
}

function redactBearerTokens(value) {
  return value.replace(
    /\bBearer\s+([^\s,;"']+)/gi,
    (match, token) => {
      if (token.startsWith(REDACTED)) {
        return match;
      }

      const trailingPunctuation = token.match(/[),.;:!?}\]]+$/)?.[0] ?? "";
      return `Bearer ${REDACTED}${trailingPunctuation}`;
    },
  );
}

function redactColonCredentials(value) {
  const pattern =
    /(^|(?<=[\s,;([{]))((?:[A-Za-z0-9_-]*)(?:password|passphrase|cookie|authorization|private[_-]key|secret[_-]key)|(?:[A-Za-z0-9_-]+[ \t]+)?(?:set[ \t]+cookie|private[ \t]+key|secret[ \t]+key))\s*:[^\r\n]*/giu;

  return value.replace(
    pattern,
    (match, boundary, label) =>
      `${boundary}${label}: ${REDACTED}`,
  );
}

function redactString(value) {
  return redactBearerTokens(
    redactQueryParams(redactColonCredentials(value)),
  );
}

function enumerableValue(key, descriptor, ancestors) {
  if (isSensitiveKey(key)) {
    return REDACTED;
  }
  if (!Object.hasOwn(descriptor, "value")) {
    return UNREADABLE;
  }
  return redactValue(descriptor.value, ancestors);
}

function redactEnumerableProperties(value, ancestors) {
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const redacted = Array.isArray(value)
    ? new Array(descriptors.length?.value ?? 0)
    : {};

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!descriptor.enumerable) {
      continue;
    }
    Object.defineProperty(redacted, key, {
      value: enumerableValue(key, descriptor, ancestors),
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  return redacted;
}

function redactValue(value, ancestors) {
  if (typeof value === "string") {
    return redactString(value);
  }

  if (value && typeof value === "object") {
    if (ancestors.has(value)) {
      return CIRCULAR;
    }

    ancestors.add(value);
    const redacted = redactEnumerableProperties(value, ancestors);
    ancestors.delete(value);
    return redacted;
  }

  return value;
}

export function redactSecrets(value) {
  return redactValue(value, new WeakSet());
}

function enumerableSnapshot(value, excludedKeys) {
  const snapshot = {};
  const descriptors = Object.getOwnPropertyDescriptors(value);

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!descriptor.enumerable || excludedKeys.has(key)) {
      continue;
    }
    Object.defineProperty(snapshot, key, {
      value: isSensitiveKey(key)
        ? REDACTED
        : Object.hasOwn(descriptor, "value")
          ? descriptor.value
          : UNREADABLE,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  return snapshot;
}

export function safeError(error) {
  if (!(error instanceof Error)) {
    return redactSecrets(error);
  }

  const details = enumerableSnapshot(
    error,
    new Set(["name", "message", "stack"]),
  );

  return redactSecrets({
    name: error.name,
    message: error.message,
    ...details,
  });
}
