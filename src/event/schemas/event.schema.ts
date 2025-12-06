import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = Eventy & Document;

@Schema({ timestamps: true })
export class Eventy {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  organizerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, min: 0 })
  nbPlaces: number;

  @Prop({ default: 0, min: 0 })
  nbrLike: number;
}

export const EventySchema = SchemaFactory.createForClass(Eventy);