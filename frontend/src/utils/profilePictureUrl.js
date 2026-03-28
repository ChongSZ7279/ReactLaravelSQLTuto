const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

function apiOrigin() {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return "http://127.0.0.1:8000";
  }
}

/**
 * Laravel APP_URL often mismatches the dev API (e.g. http://localhost vs :8000).
 * For anything under /storage, always use the same origin as REACT_APP_API_BASE_URL.
 */
function normalizeAbsoluteStorageUrl(absoluteUrl, origin) {
  try {
    const parsed = new URL(absoluteUrl);
    if (parsed.pathname.startsWith("/storage")) {
      return `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    /* ignore */
  }
  return absoluteUrl;
}

/**
 * Build a browser-loadable image URL for an employee's profile picture.
 *
 * @param {object} emp - Employee from API (profile_picture_url, profile_picture, updated_at)
 * @param {{ cacheBust?: boolean }} [options]
 * @returns {string|null}
 */
export function resolveProfilePictureSrc(emp, options = {}) {
  if (!emp) return null;

  const { profile_picture_url: rawUrl, profile_picture: path } = emp;
  const origin = apiOrigin();
  let src = null;

  // Prefer DB path + CRA env origin — ignores wrong Laravel APP_URL on absolute profile_picture_url.
  if (path) {
    const clean = String(path).replace(/^\/+/, "");
    src = `${origin}/storage/${clean}`;
  } else if (rawUrl) {
    const u = String(rawUrl).trim();
    if (/^https?:\/\//i.test(u)) {
      src = normalizeAbsoluteStorageUrl(u, origin);
    } else if (u.startsWith("/")) {
      src = `${origin}${u}`;
    }
  }

  if (src && options.cacheBust && emp.updated_at) {
    const sep = src.includes("?") ? "&" : "?";
    src = `${src}${sep}v=${encodeURIComponent(emp.updated_at)}`;
  }

  return src;
}
