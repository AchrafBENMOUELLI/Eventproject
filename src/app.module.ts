import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017/nestbackend'), FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
