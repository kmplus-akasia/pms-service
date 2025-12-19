import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(RedisService.name);
  private client: Redis;
  private isConnected = false;

  constructor() {}

  async onModuleInit() {
    await this.createRedisClient();
  }

  async onModuleDestroy() {
    await this.closeRedisClient();
  }

  private async createRedisClient() {
    const config: RedisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'pms:',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    };

    this.client = new Redis(config);

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.log('Redis client connected successfully');
    });

    this.client.on('error', (error) => {
      this.isConnected = false;
      this.logger.error('Redis client error', error);
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('close', () => {
      this.isConnected = false;
      this.logger.warn('Redis client connection closed');
    });

    // Test connection
    try {
      await this.client.ping();
      this.logger.log('Redis connection test successful');
    } catch (error) {
      this.logger.error('Redis connection test failed', error);
      throw error;
    }
  }

  private async closeRedisClient() {
    if (this.client) {
      this.client.disconnect();
      this.isConnected = false;
      this.logger.log('Redis client disconnected');
    }
  }

  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis GET failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Set value with optional TTL
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      if (ttl) {
        return await this.client.setex(key, ttl, value);
      }
      return await this.client.set(key, value);
    } catch (error) {
      this.logger.error(`Redis SET failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Delete key(s)
   */
  async del(...keys: string[]): Promise<number> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Redis DEL failed for keys: ${keys.join(', ')}`, error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<number> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.exists(key);
    } catch (error) {
      this.logger.error(`Redis EXISTS failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Set expiration time on key
   */
  async expire(key: string, seconds: number): Promise<number> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Redis EXPIRE failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get time to live for key
   */
  async ttl(key: string): Promise<number> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Redis TTL failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Increment integer value
   */
  async incr(key: string): Promise<number> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Redis INCR failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Redis KEYS failed for pattern: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValues: Record<string, string>): Promise<'OK'> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      const args: string[] = [];
      Object.entries(keyValues).forEach(([key, value]) => {
        args.push(key, value);
      });
      return await this.client.mset(...args);
    } catch (error) {
      this.logger.error('Redis MSET failed', error);
      throw error;
    }
  }

  /**
   * Get multiple values
   */
  async mget(...keys: string[]): Promise<(string | null)[]> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.mget(...keys);
    } catch (error) {
      this.logger.error(`Redis MGET failed for keys: ${keys.join(', ')}`, error);
      throw error;
    }
  }

  /**
   * Execute Redis pipeline
   */
  async pipeline(): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    return this.client.pipeline();
  }

  /**
   * Ping Redis server
   */
  async ping(): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.ping();
    } catch (error) {
      this.logger.error('Redis PING failed', error);
      throw error;
    }
  }

  /**
   * Get Redis info
   */
  async info(): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.info();
    } catch (error) {
      this.logger.error('Redis INFO failed', error);
      throw error;
    }
  }

  /**
   * Check Redis health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return false;
    }
  }

  /**
   * Get Redis client info (for debugging)
   */
  getClientInfo(): {
    host: string;
    port: number;
    db: number;
    isConnected: boolean;
    keyPrefix: string;
  } {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      db: parseInt(process.env.REDIS_DB || '0', 10),
      isConnected: this.isConnected,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'pms:',
    };
  }

  /**
   * Flush all data (dangerous - only for testing)
   */
  async flushAll(): Promise<'OK'> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FLUSHALL is not allowed in production');
    }

    if (!this.isConnected) {
      throw new Error('Redis client not connected');
    }

    try {
      return await this.client.flushall();
    } catch (error) {
      this.logger.error('Redis FLUSHALL failed', error);
      throw error;
    }
  }
}
