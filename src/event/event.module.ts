import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Eventy, EventySchema } from './schemas/event.schema';
import { Feedback, FeedbackSchema } from '../feedback/schemas/feedback.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Eventy.name, schema: EventySchema },
      { name: Feedback.name, schema: FeedbackSchema }  
    ])
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}