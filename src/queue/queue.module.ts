import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookProcessor } from './webhook.processor';
import { DeliveryAttempt, DeliveryAttemptSchema } from './delivery-attempt.schema';
import { WebhookEvent, WebhookEventSchema } from '../events/event.schema';
import {
  WebhookSubscription,
  WebhookSubscriptionSchema,
} from '../webhooks/webhook.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'webhook-delivery',
    }),
    MongooseModule.forFeature([
      { name: WebhookEvent.name, schema: WebhookEventSchema },
      { name: WebhookSubscription.name, schema: WebhookSubscriptionSchema },
      { name: DeliveryAttempt.name, schema: DeliveryAttemptSchema },
    ]),
  ],
  providers: [WebhookProcessor],
  exports: [
    BullModule, // exports the queue provider
  ],
})
export class QueueModule {}
