import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'receivedAt' } })
export class WebhookEvent extends Document {
  @Prop({ required: true, index: true })
  subscriptionId: string;

  @Prop()
  eventType: string;

  @Prop({ type: Object })
  payload: Record<string, any>;
}

export const WebhookEventSchema =
  SchemaFactory.createForClass(WebhookEvent);
