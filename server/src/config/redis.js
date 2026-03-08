// Redis client setup (optional caching layer)
let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log('Redis URL not configured, skipping Redis connection');
    return null;
  }

  try {
    const { createClient } = require('redis');
    redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn('Redis connection failed, continuing without cache:', error.message);
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
