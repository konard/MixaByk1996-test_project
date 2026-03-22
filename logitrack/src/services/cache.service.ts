import redisClient from "../config/redis";

const DEFAULT_TTL = 3600;

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  static async set(key: string, value: unknown, ttl: number = DEFAULT_TTL): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  }

  static async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  static async setDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const key = `driver:location:${driverId}`;
    await redisClient.set(
      key,
      JSON.stringify({ latitude, longitude, updatedAt: new Date().toISOString() }),
      "EX",
      300
    );
  }

  static async getDriverLocation(
    driverId: string
  ): Promise<{ latitude: number; longitude: number; updatedAt: string } | null> {
    const key = `driver:location:${driverId}`;
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  static async setActiveRoute(routeId: string, routeData: unknown): Promise<void> {
    await redisClient.set(`route:active:${routeId}`, JSON.stringify(routeData), "EX", 1800);
  }

  static async getActiveRoute(routeId: string): Promise<unknown | null> {
    const data = await redisClient.get(`route:active:${routeId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  static async addSocketSession(socketId: string, userId: string): Promise<void> {
    await redisClient.set(`socket:session:${socketId}`, userId, "EX", 86400);
    await redisClient.sadd(`user:sockets:${userId}`, socketId);
  }

  static async removeSocketSession(socketId: string): Promise<void> {
    const userId = await redisClient.get(`socket:session:${socketId}`);
    if (userId) {
      await redisClient.srem(`user:sockets:${userId}`, socketId);
    }
    await redisClient.del(`socket:session:${socketId}`);
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
}
