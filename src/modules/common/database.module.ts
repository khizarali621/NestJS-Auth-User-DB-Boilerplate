import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../user/entities/user.entity';
import { DB_COLLECTIONS } from 'src/constants/collections';

const models = [{ name: DB_COLLECTIONS.USERS, schema: UserSchema }];
@Module({
  imports: [MongooseModule.forFeature(models)],
  exports: [MongooseModule.forFeature(models)],
})
export class DatabaseModule {}
