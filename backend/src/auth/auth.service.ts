import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  private generateJwtToken(userId: string, extras: Record<string, any>) {
    const payload = {
      sub: userId,
      ...extras,
    };
    return {
      access_token: this.jwtService.sign(payload),
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
        email: body.email,
        name: body.name,
        password: hashedPassword,
        phone: body.phone,
        address: body.address,
        type: body.type,
      },
    });

    return this.generateJwtToken(newUser.id, {
      email: newUser.email,
    });
  }
}
