// backend/utils/redisClient.js
import axios from 'axios';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const setKey = async (key, value, ttlSeconds = 300) => {
  try {
    await axios.post(
      `${UPSTASH_REDIS_REST_URL}/set/${key}/${value}?EX=${ttlSeconds}`,
      {},
      {
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      }
    );
  } catch (error) {
    console.error('Redis set error:', error.message);
  }
};

export const getKey = async (key) => {
  try {
    const response = await axios.get(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
    });
    return response.data.result;
  } catch (error) {
    console.error('Redis get error:', error.message);
    return null;
  }
};

export const deleteKey = async (key) => {
  try {
    await axios.post(
      `${UPSTASH_REDIS_REST_URL}/del/${key}`,
      {},
      { headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` } }
    );
  } catch (error) {
    console.error('Redis delete error:', error.message);
  }
};