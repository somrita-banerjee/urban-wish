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

    return this.generateJwtToken(findUser.id, {
      email: findUser.email,
    });
  }

  private async generateJwtToken(userId: string, extras: Record<string, any>) {
    const payload = {
      sub: userId,
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

    return this.generateJwtToken(newUser.id, {
      email: newUser.email,
    });
  }
}
