import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookSubscription extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ required: true })
  callbackUrl: string;

  @Prop()
  secret: string; // used for webhook signing (HMAC)

  @Prop({ type: [String], default: [] })
  eventTypes: string[]; // optional filtering

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export const WebhookSubscriptionSchema =
  SchemaFactory.createForClass(WebhookSubscription);
