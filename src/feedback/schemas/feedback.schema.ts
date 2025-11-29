import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
  @Prop({ required: true })
  id_user: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Eventy', required: true })
  id_event: MongooseSchema.Types.ObjectId;  // ← Référence ObjectId

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 0, max: 5 })
  rate: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);


//@Schema Marks the class as a MongoDB document
//@Prop Marks the class as a MongoDB document
//SchemaFactory.createForClass(Feedback) : Converts your TypeScript class into an actual Mongoose schema
