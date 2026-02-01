import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'attemptedAt' } })
export class DeliveryAttempt extends Document {
  @Prop({ required: true, index: true })
  eventId: string;

  @Prop({ required: true })
  attempt: number;

  @Prop({ enum: ['SUCCESS', 'FAILED'], required: true })
  status: 'SUCCESS' | 'FAILED';

  @Prop()
  responseCode?: number;

  @Prop()
  error?: string;
}

export const DeliveryAttemptSchema =
  SchemaFactory.createForClass(DeliveryAttempt);
