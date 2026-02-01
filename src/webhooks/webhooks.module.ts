import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookEvent, WebhookEventSchema } from 'src/events/event.schema';
import { WebhookSubscription, WebhookSubscriptionSchema } from './webhook.schema';

@Module({
    imports:[MongooseModule.forFeature([
          { name: WebhookEvent.name, schema: WebhookEventSchema },
          { name: WebhookSubscription.name, schema: WebhookSubscriptionSchema }
        ])],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
