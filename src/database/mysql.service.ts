import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
  reconnect: boolean;
  reconnectInterval: number;
}

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(MysqlService.name);
  private pool: mysql.Pool;
  private isConnected = false;

  constructor() {}

  async onModuleInit() {
    await this.createConnectionPool();
  }

  async onModuleDestroy() {
    await this.closeConnectionPool();
  }

  private async createConnectionPool() {
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_DATABASE;

    if (!username || !password || !database) {
      throw new Error(
        'Database configuration incomplete. Please set DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables.'
      );
    }

    const config: DatabaseConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username,
      password,
      database,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      reconnectInterval: 5000,
    };

    try {
      this.pool = mysql.createPool(config);
      await this.testConnection();
      this.isConnected = true;
      this.logger.log('Database connection pool created successfully');
    } catch (error) {
      this.logger.error('Failed to create database connection pool', error);
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute('SELECT 1');
      this.logger.log('Database connection test successful');
    } finally {
      connection.release();
    }
  }

  private async closeConnectionPool() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      this.logger.log('Database connection pool closed');
    }
  }

  /**
   * Execute a SELECT query
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isConnected) {
      throw new Error('Database connection not available');
    }

    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as T[];
    } catch (error) {
      this.logger.error(`Query execution failed: ${sql}`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE query
   */
  async execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
    if (!this.isConnected) {
      throw new Error('Database connection not available');
    }

    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.execute(sql, params);
      return result as mysql.ResultSetHeader;
    } catch (error) {
      this.logger.error(`Query execution failed: ${sql}`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    if (!this.isConnected) {
      throw new Error('Database connection not available');
    }

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      this.logger.error('Transaction failed, rolled back', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get a raw connection (use with caution)
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.isConnected) {
      throw new Error('Database connection not available');
    }
    return this.pool.getConnection();
  }

  /**
   * Check database health
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  /**
   * Get database connection info (for debugging)
   */
  getConnectionInfo(): {
    host: string;
    port: number;
    database: string;
    connectionLimit: number;
    isConnected: boolean;
  } {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      database: process.env.DB_DATABASE || 'unknown',
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
      isConnected: this.isConnected,
    };
  }
}
