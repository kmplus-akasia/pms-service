import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

export interface RabbitMQConfig {
  url: string;
  connectionRetries: number;
  connectionRetryDelay: number;
  prefetch: number;
  heartbeat: number;
}

export interface QueueMessage {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount?: number;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isConnected = false;

  constructor() {}

  async onModuleInit() {
    await this.createConnection();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async createConnection() {
    const config: RabbitMQConfig = {
      url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      connectionRetries: parseInt(process.env.RABBITMQ_CONNECTION_RETRIES || '5', 10),
      connectionRetryDelay: parseInt(process.env.RABBITMQ_CONNECTION_RETRY_DELAY || '5000', 10),
      prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '1', 10),
      heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT || '60', 10),
    };

    let retries = config.connectionRetries;

    while (retries > 0) {
      try {
        this.connection = await amqp.connect(config.url, {
          heartbeat: config.heartbeat,
        });

        this.channel = await this.connection.createChannel();
        await this.channel.prefetch(config.prefetch);

        this.connection.on('error', (error) => {
          this.isConnected = false;
          this.logger.error('RabbitMQ connection error', error);
        });

        this.connection.on('close', () => {
          this.isConnected = false;
          this.logger.warn('RabbitMQ connection closed');
        });

        this.isConnected = true;
        this.logger.log('RabbitMQ connection established successfully');
        break;
      } catch (error) {
        retries--;
        this.logger.warn(
          `RabbitMQ connection failed (${config.connectionRetries - retries}/${config.connectionRetries}). Retries left: ${retries}`
        );

        if (retries === 0) {
          this.logger.error('Failed to establish RabbitMQ connection after all retries', error);
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, config.connectionRetryDelay));
      }
    }
  }

  private async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }

  /**
   * Assert a queue exists
   */
  async assertQueue(queueName: string, options?: amqp.Options.AssertQueue): Promise<amqp.Replies.AssertQueue> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.assertQueue(queueName, options);
    } catch (error) {
      this.logger.error(`Failed to assert queue: ${queueName}`, error);
      throw error;
    }
  }

  /**
   * Assert an exchange exists
   */
  async assertExchange(
    exchangeName: string,
    type: string,
    options?: amqp.Options.AssertExchange
  ): Promise<amqp.Replies.AssertExchange> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.assertExchange(exchangeName, type, options);
    } catch (error) {
      this.logger.error(`Failed to assert exchange: ${exchangeName}`, error);
      throw error;
    }
  }

  /**
   * Bind a queue to an exchange
   */
  async bindQueue(
    queue: string,
    exchange: string,
    routingKey: string,
    args?: any
  ): Promise<amqp.Replies.Empty> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.bindQueue(queue, exchange, routingKey, args);
    } catch (error) {
      this.logger.error(`Failed to bind queue ${queue} to exchange ${exchange}`, error);
      throw error;
    }
  }

  /**
   * Publish a message to an exchange
   */
  async publishMessage(
    exchange: string,
    routingKey: string,
    message: QueueMessage,
    options?: amqp.Options.Publish
  ): Promise<boolean> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        ...options,
      });
    } catch (error) {
      this.logger.error(`Failed to publish message to exchange: ${exchange}`, error);
      throw error;
    }
  }

  /**
   * Send a message to a queue
   */
  async sendToQueue(
    queue: string,
    message: QueueMessage,
    options?: amqp.Options.Publish
  ): Promise<boolean> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      return this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
        ...options,
      });
    } catch (error) {
      this.logger.error(`Failed to send message to queue: ${queue}`, error);
      throw error;
    }
  }

  /**
   * Consume messages from a queue
   */
  async consumeQueue(
    queue: string,
    callback: (message: QueueMessage, ack: () => void, nack: () => void) => Promise<void>,
    options?: amqp.Options.Consume
  ): Promise<amqp.Replies.Consume> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
          const message: QueueMessage = JSON.parse(msg.content.toString());
          const ack = () => this.channel.ack(msg);
          const nack = () => this.channel.nack(msg, false, false);
          await callback(message, ack, nack);
        } catch (error) {
          this.logger.error(`Error processing message from queue: ${queue}`, error);
          this.channel.nack(msg, false, false);
        }
      }, options);
    } catch (error) {
      this.logger.error(`Failed to consume from queue: ${queue}`, error);
      throw error;
    }
  }

  /**
   * Get message count in queue
   */
  async getQueueMessageCount(queue: string): Promise<number> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      const queueInfo = await this.channel.assertQueue(queue, { passive: true });
      return queueInfo.messageCount;
    } catch (error) {
      this.logger.error(`Failed to get message count for queue: ${queue}`, error);
      throw error;
    }
  }

  /**
   * Purge all messages from queue
   */
  async purgeQueue(queue: string): Promise<amqp.Replies.PurgeQueue> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.purgeQueue(queue);
    } catch (error) {
      this.logger.error(`Failed to purge queue: ${queue}`, error);
      throw error;
    }
  }

  /**
   * Delete a queue
   */
  async deleteQueue(queue: string, options?: amqp.Options.DeleteQueue): Promise<amqp.Replies.DeleteQueue> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.deleteQueue(queue, options);
    } catch (error) {
      this.logger.error(`Failed to delete queue: ${queue}`, error);
      throw error;
    }
  }

  /**
   * Delete an exchange
   */
  async deleteExchange(exchange: string, options?: amqp.Options.DeleteExchange): Promise<amqp.Replies.Empty> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ client not connected');
    }

    try {
      return await this.channel.deleteExchange(exchange, options);
    } catch (error) {
      this.logger.error(`Failed to delete exchange: ${exchange}`, error);
      throw error;
    }
  }

  /**
   * Check RabbitMQ health
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected || !this.channel) {
        return false;
      }

      // Try to create a temporary queue to test connectivity
      const { queue } = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.deleteQueue(queue);
      return true;
    } catch (error) {
      this.logger.error('RabbitMQ health check failed', error);
      return false;
    }
  }

  /**
   * Get RabbitMQ connection info (for debugging)
   */
  getConnectionInfo(): {
    url: string;
    isConnected: boolean;
    prefetch: number;
  } {
    return {
      url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      isConnected: this.isConnected,
      prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '1', 10),
    };
  }

  /**
   * Create a standardized message
   */
  createMessage(type: string, data: any, retryCount = 0): QueueMessage {
    return {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount,
    };
  }
}
