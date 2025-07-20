import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { user_type } from '@prisma/client';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';
import { CartDto } from './order.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async updateCart(dto: CartDto, user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new Error('Only buyers can create or update carts.');
    }

    try {
      await this.prismaService.cart_items.deleteMany({
        where: { user_id: user.sub },
      });
      const cartItems = await this.prismaService.cart_items.createMany({
        data: dto.items.map((item) => ({
          user_id: user.sub,
          product_id: item.product,
          quantity: item.quantity,
        })),
      });

      return `Your cart has ${cartItems.count} products`;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
          description: 'Failed to retrieve product',
        },
      );
    }
  }

  async getCartItems(user: JwtUser): Promise<CartDto> {
    const items = await this.prismaService.cart_items.findMany({
      where: { user_id: user.sub },
    });

    return {
      items: items.map((item) => ({
        product: item.product_id,
        quantity: item.quantity ?? 0,
      })),
    };
  }

  async createOrder(user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new Error('Only buyers can create orders.');
    }
    // continue with order creation logic
  }
}
