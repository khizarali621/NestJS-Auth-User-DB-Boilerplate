// user.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { jwtConstants } from 'src/constants/jwt.constant';
import * as bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: string;
  password: string;
  email: string;
  checkPassword?(password: string): Promise<boolean>;
}

export const UserSchema = new Schema<UserDocument>(
  {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    profile: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password
  return obj;
};

UserSchema.post('save', function (error, doc, next) {
  console.log(error, 'error=-=--=');
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error(`${Object.keys(error.keyValue)[0]} must be unique`));
  } else {
    next(error);
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  // const user: any = this;
  // if (!user.password) {
  //   next();
  //   return;
  // }
  const hash = await bcrypt.hash(this.password, jwtConstants.salt);
  this.password = hash;
  next();
});

UserSchema.methods.checkPassword = function (
  password: string,
): Promise<boolean> {
  const user = this as UserDocument;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        reject(error);
      }

      resolve(isMatch);
    });
  });
};

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
