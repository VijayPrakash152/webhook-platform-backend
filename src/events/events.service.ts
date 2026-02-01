import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WebhookEvent } from './event.schema';
import { WebhookSubscription } from '../webhooks/webhook.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(WebhookEvent.name)
    private eventModel: Model<WebhookEvent>,

    @InjectModel(WebhookSubscription.name)
    private subscriptionModel: Model<WebhookSubscription>,

    @InjectQueue('webhook-delivery')
    private deliveryQueue: Queue,
  ) {}

  /**
   * 1. Validate subscription
   * 2. Persist webhook event
   * 3. Enqueue async delivery job
   */
  async ingest(subscriptionId: string, payload: any) {
  const subscription = await this.subscriptionModel.findOne({
    _id: subscriptionId,
    isActive: true,
  });

  if (!subscription) {
    throw new NotFoundException('Webhook subscription not found');
  }

  const event = await this.eventModel.create({
    subscriptionId,
    eventType: payload.type ?? 'unknown',
    payload,
  });

  // 👇 THIS IS WHERE YOUR CODE GOES
  await this.deliveryQueue.add(
    'deliver',
    { eventId: event.id },
    {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true, // optional, keeps Redis clean
    },
  );

  return { status: 'queued', eventId: event.id };
}


  /**
   * Used by frontend to show event history
   */
  async findByUser(userId: string) {
    const subs = await this.subscriptionModel.find({ userId }).select('_id');

    return this.eventModel
      .find({ subscriptionId: { $in: subs.map(s => s.id) } })
      .sort({ receivedAt: -1 });
  }
}
