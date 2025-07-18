import {  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserFromAuth } from 'src/decorator/userFromAuth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login Credentials' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @ApiOperation({ summary: 'Register for user' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: 'Get my details' })
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@UserFromAuth() user: any) {
    return user;
  }
}
