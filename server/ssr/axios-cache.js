/**
 * Simple in-memory cache for axios requests (SSR only)
 * No external dependencies - uses Map for storage
 *
 * @param {number} maxSize - Maximum number of cache entries (default: 500)
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {boolean} debug - Enable debug logging (default: false)
 */

class SimpleCache {
  constructor(maxSize = 500, ttl = 5 * 60 * 1000, debug = false) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.stats = { hits: 0, misses: 0 };
    this.debug = debug;
    this.excludeStatusCodes = [401, 403]; // Don't cache unauthorized/forbidden
  }

  generateKey(config) {
    const { method = "get", url, params } = config;
    return `${method.toUpperCase()}:${url}:${JSON.stringify(params || {})}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      if (this.debug) console.log(`[Cache MISS] ${key}`);
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      if (this.debug) console.log(`[Cache EXPIRED] ${key}`);
      return null;
    }

    this.stats.hits++;
    if (this.debug) console.log(`[Cache HIT] ${key}`);
    return entry.data;
  }

  set(key, data, customTtl) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      if (this.debug) console.log(`[Cache EVICT] ${firstKey}`);
    }

    const ttl = customTtl || this.ttl;
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
    if (this.debug) console.log(`[Cache SET] ${key} (TTL: ${ttl}ms)`);
  }

  shouldExclude(url, statusCode) {
    // Check status codes
    if (this.excludeStatusCodes.includes(statusCode)) {
      return true;
    }

    return false;
  }

  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? `${((this.stats.hits / total) * 100).toFixed(2)}%` : "0%",
      debug: this.debug,
      excludeStatusCodes: this.excludeStatusCodes,
    };
  }
}

// Create cache instance with configuration
// Content update strategy:
// - Updates: rare (once per 6 months)
// - New additions: several times per day
// → Use aggressive caching with longer TTL
const cache = new SimpleCache(
  1500, // Max 1500 entries
  30 * 60 * 1000, // 30 minutes TTL
  process.env.CACHE_DEBUG === "true" // Debug mode from env var
);

/**
 * Check if URL should not be cached (personal/user-specific data)
 */
function shouldSkipCache(url) {
  if (!url) return false;

  // Don't cache personal/user-specific endpoints
  const skipPatterns = [
    "/personal/",
    "/my/",
    "/rest/playlists",
    "/rest/bookmarks",
    "/rest/history",
    "/rest/reactions",
    "/rest/notes",
    "/rest/labels",
    "/settings",
    "/languages",
    "/reaction_count",
    "/search",

    "bearer", // Requests with authorization
  ];

  return skipPatterns.some((pattern) => url.includes(pattern));
}

/**
 * Creates axios interceptor for caching
 * @param {Object} axiosInstance - Axios instance to add caching to
 */
export function setupAxiosCache(axiosInstance) {
  // Request interceptor - check cache before making request
  axiosInstance.interceptors.request.use(
    (config) => {
      // Only cache GET requests
      if (config.method?.toLowerCase() !== "get") {
        return config;
      }

      // Skip cache if explicitly disabled
      if (config.cache === false) {
        return config;
      }

      // Don't cache personal/user-specific URLs
      if (shouldSkipCache(config.url)) {
        return config;
      }

      // Don't cache requests with authorization headers
      if (config.headers && config.headers.Authorization) {
        return config;
      }

      const key = cache.generateKey(config);
      const cached = cache.get(key);

      if (cached) {
        // Mark this request as cached
        config._fromCache = true;
        config._cachedData = cached;

        // Use custom adapter that waits before resolving
        config.adapter = () =>
          new Promise((resolve) => {
            // Use 1ms delay to ensure React doesn't see this as synchronous
            // This prevents Suspense issues in SSR
            setTimeout(() => {
              resolve({
                data: cached,
                status: 200,
                statusText: "OK",
                headers: { "x-cache": "HIT" },
                config,
                request: {},
              });
            }, 1); // 1ms minimum delay
          });
      }

      // Store key for response interceptor
      config._cacheKey = key;

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - store successful responses
  axiosInstance.interceptors.response.use(
    (response) => {
      const { config } = response;

      // Only cache GET requests with successful responses
      if (
        config.method?.toLowerCase() === "get" &&
        response.status >= 200 &&
        response.status < 400 &&
        config.cache !== false &&
        config._cacheKey &&
        !cache.shouldExclude(config.url, response.status)
      ) {
        // Check for Cache-Control header
        let customTtl;
        const cacheControl = response.headers["cache-control"];
        if (cacheControl) {
          const maxAge = cacheControl.match(/max-age=(\d+)/);
          if (maxAge) {
            customTtl = parseInt(maxAge[1], 10) * 1000;
          }
        }

        // Allow per-request TTL override
        if (config.cacheTtl) {
          customTtl = config.cacheTtl;
        }

        cache.set(config._cacheKey, response.data, customTtl);
      }

      return response;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.getStats();
}

/**
 * Clear all cache
 */
export function clearCache() {
  cache.clear();
  console.log("[SSR Cache] Cache cleared");
}

const axiosCache = {
  setupAxiosCache,
  getCacheStats,
  clearCache,
};

export default axiosCache;
