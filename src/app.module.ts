import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017/nestbackend'), FeedbackModule, EventModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
