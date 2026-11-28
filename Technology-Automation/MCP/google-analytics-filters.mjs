// Read-only report filters for the TravelFrame GA4 MCP.
// Builds GA4 Data API `dimensionFilter` objects; never calls any write endpoint.

// Drupal admin, editor and login paths that must not count as visitor traffic.
export const INTERNAL_PATH_REGEX =
  "^/(travelframe-admin|admin|node/add|node/[0-9]+/(edit|delete|revisions)|side-user|user|login)([/?#].*)?$";

/**
 * Build a GA4 dimensionFilter that excludes internal/admin paths.
 * @param {object} opts
 * @param {boolean} [opts.excludeInternal] add INTERNAL_PATH_REGEX
 * @param {string} [opts.excludePathRegex] extra full-match regex to exclude
 * @param {string} [opts.fieldName] dimension to filter (pagePath or landingPage)
 * @returns {object|undefined} dimensionFilter or undefined when no filter applies
 */
export function buildPathExclusionFilter({ excludeInternal = false, excludePathRegex, fieldName = "pagePath" } = {}) {
  const patterns = [];
  if (excludeInternal) patterns.push(INTERNAL_PATH_REGEX);
  if (excludePathRegex) {
    try {
      new RegExp(excludePathRegex);
    } catch {
      throw new Error(`exclude_path_regex is not a valid regular expression: ${excludePathRegex}`);
    }
    patterns.push(excludePathRegex);
  }
  if (patterns.length === 0) return undefined;
  const expressions = patterns.map((value) => ({
    notExpression: {
      filter: { fieldName, stringFilter: { matchType: "FULL_REGEXP", value } },
    },
  }));
  return expressions.length === 1 ? expressions[0] : { andGroup: { expressions } };
}
