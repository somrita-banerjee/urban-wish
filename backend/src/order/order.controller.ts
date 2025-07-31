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

  @Post('')
  create(@UserFromAuth() user: JwtUser) {
    return this.orderService.createOrder(user);
  }

  @Get('')
  findAllOrders(@UserFromAuth() user: JwtUser) {
    return this.orderService.findAllOrders(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserFromAuth() user: JwtUser) {
    return this.orderService.findOneOrder(id, user);
  }

  @Post('payment-verify')
  async verifyPayment(@Body() body: any, @UserFromAuth() user: JwtUser) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required parameters for payment verification');
    }

    return this.orderService.updateOrderOnPaymentVerification(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
    );
    
  }
}
