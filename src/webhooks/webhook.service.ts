import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookSubscription } from './webhook.schema';
import * as crypto from 'crypto';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(WebhookSubscription.name)
    private readonly webhookModel: Model<WebhookSubscription>,
  ) {}

  /**
   * Create a new webhook subscription for a user
   */
  async create(userId: string, dto: CreateWebhookDto) {
    const secret = crypto.randomBytes(32).toString('hex');

    return this.webhookModel.create({
      userId,
      sourceUrl: dto.sourceUrl,
      callbackUrl: dto.callbackUrl,
      eventTypes: dto.eventTypes ?? [],
      secret,
    });
  }

  /**
   * List all webhooks for a user
   */
  async findAll(userId: string) {
    return this.webhookModel.find({ userId });
  }

  /**
   * Soft delete / cancel a webhook
   */
  async cancel(webhookId: string, userId: string) {
    const webhook = await this.webhookModel.findById(webhookId);

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (webhook.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    webhook.isActive = false;
    await webhook.save();

    return { status: 'cancelled' };
  }
}
