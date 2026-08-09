import mongoose, { Schema, Document } from 'mongoose';

export interface IWebhookLog extends Document {
  eventId: string;
  eventType: string;
  payload: Record<string, any>;
  processed: boolean;
  createdAt: Date;
}

const webhookLogSchema = new Schema<IWebhookLog>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    processed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WebhookLog = mongoose.model<IWebhookLog>('WebhookLog', webhookLogSchema);
