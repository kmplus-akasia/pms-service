import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeoutMillis?: number;
  timeout?: number;
  namedPlaceholders?: boolean;
}

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(MysqlService.name);
  private pool: mysql.Pool;
  private isConnected = false;

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createConnectionPool();
  }

  async onModuleDestroy() {
    await this.closeConnectionPool();
  }

  private async createConnectionPool() {
    const config: DatabaseConfig = {
      host: this.configService.get('DB_HOST') || 'localhost',
      port: parseInt(this.configService.get('DB_PORT') || '3306', 10),
      user: this.configService.get('DB_USERNAME') || '',
      password: this.configService.get('DB_PASSWORD') || '',
      database: this.configService.get('DB_DATABASE') || '',
      connectionLimit: parseInt(this.configService.get('DB_CONNECTION_LIMIT') || '10', 10),
      acquireTimeoutMillis: 60000,
      namedPlaceholders: true,
    };

    if (!config.user || !config.password || !config.database) {
      throw new Error(
        'Database configuration incomplete. Please set DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables.'
      );
    }

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
  async query<T = any>(sql: string, params: any = []): Promise<T[]> {
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
