// In-Memory Startup Suggestions Cache Map
const cache = new Map();

// Strict 15-minute TTL boundary (15 mins * 60 secs * 1000 ms)
const TTL_MILLISECONDS = 15 * 60 * 1000;

/**
 * Retrieve cached suggestions for a specific user context
 * @param {string} userId - User document ID
 * @returns {Array|null} Array of recommendations, or null if expired/missing
 */
export const getCachedSuggestions = (userId) => {
  const cacheEntry = cache.get(userId);

  if (!cacheEntry) {
    return null;
  }

  // Check if cache entry has expired
  if (Date.now() > cacheEntry.expiry) {
    console.log(`[Cache] Evicting expired recommendations cache entry for user: ${userId}`);
    cache.delete(userId); // Purge memory socket
    return null;
  }

  console.log(`[Cache] Cache hit! Serving in-memory startup suggestions for user: ${userId}`);
  return cacheEntry.data;
};

/**
 * Store generated suggestions in the local cache
 * @param {string} userId - User document ID
 * @param {Array} data - Array of recommended business concepts
 */
export const setCachedSuggestions = (userId, data) => {
  const expiry = Date.now() + TTL_MILLISECONDS;
  
  console.log(`[Cache] Registering new startup recommendations cache entry for user: ${userId} (TTL: 15 mins)`);
  cache.set(userId, {
    data,
    expiry,
  });
};

/**
 * Manually evict cache entry (useful when user adds/deletes physical assets)
 * @param {string} userId - User document ID
 */
export const clearCachedSuggestions = (userId) => {
  if (cache.has(userId)) {
    console.log(`[Cache] Manually clearing recommendations cache for user: ${userId}`);
    cache.delete(userId);
  }
};
