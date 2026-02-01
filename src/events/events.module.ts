import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { WebhookEvent, WebhookEventSchema } from './event.schema';
import {
  WebhookSubscription,
  WebhookSubscriptionSchema,
} from '../webhooks/webhook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebhookEvent.name, schema: WebhookEventSchema },
      { name: WebhookSubscription.name, schema: WebhookSubscriptionSchema },
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
