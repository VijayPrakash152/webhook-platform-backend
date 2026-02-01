import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookEvent } from '../events/event.schema';
import { WebhookSubscription } from '../webhooks/webhook.schema';
import { DeliveryAttempt } from './delivery-attempt.schema';

@Processor('webhook-delivery')
export class WebhookProcessor extends WorkerHost {
  constructor(
    @InjectModel(WebhookEvent.name)
    private readonly eventModel: Model<WebhookEvent>,

    @InjectModel(WebhookSubscription.name)
    private readonly subscriptionModel: Model<WebhookSubscription>,

    @InjectModel(DeliveryAttempt.name)
    private readonly deliveryAttemptModel: Model<DeliveryAttempt>,
  ) {
    super();
  }

  /**
   * BullMQ calls this automatically.
   * Retries & backoff are configured at queue level.
   */
  async process(job: Job<{ eventId: string }>): Promise<void> {
    const { eventId } = job.data;

    const event = await this.eventModel.findById(eventId);
    if (!event) return;

    const subscription = await this.subscriptionModel.findById(
      event.subscriptionId,
    );
    if (!subscription || !subscription.isActive) return;

    try {
      const response = await axios.post(
        subscription.callbackUrl,
        event.payload,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': event.eventType,
          },
        },
      );

      await this.deliveryAttemptModel.create({
        eventId: event.id,
        attempt: job.attemptsMade + 1,
        status: 'SUCCESS',
        responseCode: response.status,
      });
    } catch (error) {
      await this.deliveryAttemptModel.create({
        eventId: event.id,
        attempt: job.attemptsMade + 1,
        status: 'FAILED',
        responseCode: error.response?.status,
        error: error.message,
      });

      // IMPORTANT:
      // Throwing causes BullMQ retry with backoff
      throw error;
    }
  }
}
