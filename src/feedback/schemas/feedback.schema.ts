import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) 
  id_user: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Eventy', required: true })
  id_event: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 0, max: 5 })
  rate: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);