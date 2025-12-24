/**
 * Build a URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Object with query parameters
 * @returns Complete URL with query string
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Parse query string to object
 * @param queryString - Query string (with or without leading ?)
 * @returns Object with parsed parameters
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Convert object to query string
 * @param params - Object with parameters
 * @returns Query string (without leading ?)
 */
export function objectToQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Get domain from URL
 * @param url - URL string
 * @returns Domain name
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Check if URL is absolute
 * @param url - URL string
 * @returns true if absolute, false otherwise
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Join URL paths
 * @param base - Base URL
 * @param paths - Path segments to join
 * @returns Joined URL
 */
export function joinUrl(base: string, ...paths: string[]): string {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPaths = paths.map(p => {
    let path = p.startsWith('/') ? p.slice(1) : p;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return path;
  }).filter(Boolean);

  return [cleanBase, ...cleanPaths].join('/');
}
