// auth/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './entities/user.entity';
import { DB_COLLECTIONS } from 'src/constants/collections';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(DB_COLLECTIONS.USERS)
    readonly userModel: Model<UserDocument>,
  ) {}

  create(data):Promise<UserDocument> {
    return this.userModel.create(data);
  }
  async findOne(clause: {
    [key: string]: unknown;
  }): Promise<UserDocument | undefined> {
    return this.userModel.findOne(clause).exec();
  }

  async findUserById(id: string): Promise<UserDocument> {
    return (
      this.userModel
        .findById(id)
        .exec()
    );
  }
}
