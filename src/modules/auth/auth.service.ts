// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/modules/user/entities/user.entity';
import { SignInInput } from './dto/create-auth.dto';
import { SignOutResult } from './dto/update-auth.dto';
import { jwtConstants } from 'src/constants/jwt.constant';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createJwt(
    u: UserDocument,
  ): Promise<{ user: UserDocument; access_token: string }> {
    const user = {
      email: u.email,
      _id: u._id,
    };

    const jwt = await this.jwtService.signAsync(user, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expire,
    });
    const payload = {
      ...u.toJSON(),
    };

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user: payload,
      access_token: jwt,
    };
  }

  async signup(body: SignInInput): Promise<SignOutResult> {
    const isAlreadyUser = await this.userService.findOne({
      $or: [
        { email: body.email } /* , { userName: body.email.toLowerCase() } */,
      ],
    });

    if (isAlreadyUser) {
      return { message: 'User already registered, Please Login' };
    }

    const createdUser = await this.userService.create(body);

    return this.createJwt(createdUser);
  }

  async login({ email, password }): Promise<SignOutResult> {

    let userToAttempt: UserDocument | undefined;

    userToAttempt = await this.userService.findOne({
      email: {
        $regex: `^${email}$`,
        $options: 'i',
      },
    });

    if (!userToAttempt) {

      return { message: 'No user found with this email' };
    }

    let isMatch = await userToAttempt.checkPassword(password);

    if (isMatch) {
      return this.createJwt(userToAttempt);
    } else {
      return { message: 'Incorrect email or password' };
    }
  }

}
