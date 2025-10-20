/**
 * Simple in-memory cache for axios requests (SSR only)
 * No external dependencies - uses Map for storage
 */

class SimpleCache {
  constructor(maxSize = 500, ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.stats = { hits: 0, misses: 0 };
  }

  generateKey(config) {
    const { method = 'get', url, params } = config;
    return `${method.toUpperCase()}:${url}:${JSON.stringify(params || {})}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  set(key, data, customTtl) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + (customTtl || this.ttl),
    });
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
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? `${((this.stats.hits / total) * 100).toFixed(2)}%` : '0%',
    };
  }
}

// Create cache instance
const cache = new SimpleCache(500, 5 * 60 * 1000); // 500 entries, 5 minutes TTL

/**
 * Creates axios interceptor for caching
 * @param {Object} axiosInstance - Axios instance to add caching to
 */
export function setupAxiosCache(axiosInstance) {
  // Request interceptor - check cache before making request
  axiosInstance.interceptors.request.use(
    config => {
      // Only cache GET requests
      if (config.method?.toLowerCase() !== 'get') {
        return config;
      }

      // Skip cache if explicitly disabled
      if (config.cache === false) {
        return config;
      }

      const key = cache.generateKey(config);
      const cached = cache.get(key);

      if (cached) {
        // Mark this request as cached
        config._fromCache = true;
        config._cachedData = cached;

        // Use custom adapter that waits before resolving
        config.adapter = () => new Promise(resolve => {
          // Use 1ms delay to ensure React doesn't see this as synchronous
          // This prevents Suspense issues in SSR
          setTimeout(() => {
            resolve({
              data: cached,
              status: 200,
              statusText: 'OK',
              headers: { 'x-cache': 'HIT' },
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
    error => Promise.reject(error)
  );

  // Response interceptor - store successful responses
  axiosInstance.interceptors.response.use(
    response => {
      const { config } = response;

      // Only cache GET requests with successful responses
      if (
        config.method?.toLowerCase() === 'get' &&
        response.status >= 200 &&
        response.status < 400 &&
        config.cache !== false &&
        config._cacheKey
      ) {
        // Check for Cache-Control header
        let customTtl;
        const cacheControl = response.headers['cache-control'];
        if (cacheControl) {
          const maxAge = cacheControl.match(/max-age=(\d+)/);
          if (maxAge) {
            customTtl = parseInt(maxAge[1], 10) * 1000;
          }
        }

        cache.set(config._cacheKey, response.data, customTtl);
      }

      return response;
    },
    error => Promise.reject(error)
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
  console.log('[SSR Cache] Cache cleared');
}

const axiosCache = {
  setupAxiosCache,
  getCacheStats,
  clearCache,
};

export default axiosCache;

