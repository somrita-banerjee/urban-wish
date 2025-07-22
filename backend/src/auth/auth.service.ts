import {  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { user_type } from '@prisma/client';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (
      !findUser ||
      !(await bcrypt.compare(body.password, findUser.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateJwtToken(findUser.id, findUser.type, {
      email: findUser.email,
    });
    
    return {
      type: findUser?.type,
      ...token,
    };
  }

  private async generateJwtToken(
    userId: string,
    userType: user_type,
    extras: Record<string, any>,
  ) {
    const payload: JwtUser = {
      sub: userId,
      user_type: userType,
      ...extras,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async register(body: RegisterDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: parseInt(body.phone, 10),
        address: body.address,
        type: body.type,
      },
    });

    const token = await this.generateJwtToken(newUser.id, newUser.type, {
      email: newUser.email,
    });

    return {
      type: body.type,
      ...token
    }
  }

  async getMe(user: JwtUser) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        type: true,
      },
    });
    if (!foundUser) {
      throw new UnauthorizedException('User not Found');
    }
    return foundUser;
  }
}
