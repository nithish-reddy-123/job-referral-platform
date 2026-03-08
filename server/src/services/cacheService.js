const { getRedisClient } = require('../config/redis');

const DEFAULT_TTL = 300; // 5 minutes

const cacheService = {
  async get(key) {
    const client = getRedisClient();
    if (!client) return null;

    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, value, ttl = DEFAULT_TTL) {
    const client = getRedisClient();
    if (!client) return;

    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async del(key) {
    const client = getRedisClient();
    if (!client) return;

    try {
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  },

  async invalidatePattern(pattern) {
    const client = getRedisClient();
    if (!client) return;

    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  },
};

module.exports = cacheService;
