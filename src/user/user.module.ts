import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    JwtModule.register({
      secret: 'your-secret-key-change-this-in-production',  // ⚠️ À changer en production
      signOptions: { expiresIn: '7d' },  // Token valide 7 jours
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // Pour pouvoir l'utiliser dans d'autres modules
})
export class UserModule {}