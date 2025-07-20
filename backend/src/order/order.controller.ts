import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDto } from './order.dto';
import { JwtUser, UserFromAuth } from 'src/decorator/userFromAuth.decorator';
import { OrderService } from './order.services';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private prismaService: PrismaService,
    private orderService: OrderService,
  ) {} // Controller methods will be defined here

  @Patch('cart')
  update(@Body() cartDto: CartDto, @UserFromAuth() user: JwtUser) {
    return this.orderService.updateCart(cartDto, user);
  }

  @Get('cart')
  findAll(@UserFromAuth() user: JwtUser) {
    return this.orderService.getCartItems(user);
  }

  @Post('order')
  create(@UserFromAuth() user: JwtUser) {
    return this.orderService.createOrder(user);
  }
}
