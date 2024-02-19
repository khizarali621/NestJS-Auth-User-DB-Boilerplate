// auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/create-auth.dto';
import { SignOutResult } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignInInput): Promise<SignOutResult> {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) : Promise<SignOutResult> {
    return this.authService.login(body);
  }
}
