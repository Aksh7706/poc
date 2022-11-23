import { RedisClientType } from '@redis/client';
import * as redis from 'redis';
import crypto from 'crypto';

export class RedisHelper {
  public static client: RedisClientType;

  static getRedis() {
    if (this.client === null || !this.client)
    //create new one
    this.client = redis.createClient({ url: process.env.REDIS_URL });

    return this.client;
  }

  static async setup() {
    const client = this.getRedis();
    console.log('Connecting to Redis...');
    await client.connect();
    console.log('Connected to Redis...');
  }

  static async createOTP(walletAddress: string): Promise<string> {
    var id = crypto.randomBytes(10).toString('hex');
    await this.client.setEx(id, 180, walletAddress);
    return id;
  }

  static async getWalletFromOTP(otp: string): Promise<string | null> {
    return this.client.get(otp);
  }
}
