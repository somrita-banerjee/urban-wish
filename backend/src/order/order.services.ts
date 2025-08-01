import {  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { order_status, user_type } from '@prisma/client';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';
import { CartDto } from './order.dto';
import { v4 as uuidv4 } from 'uuid';
import { RazorpayService } from 'src/razorpay';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    private prismaService: PrismaService,
    private razorpayService: RazorpayService,
  ) {}

  async updateCart(dto: CartDto, user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new Error('Only buyers can create or update carts.');
    }

    try {
      await this.prismaService.cart_items.deleteMany({
        where: { user_id: user.sub },
      });

      const uniqueItemsMap = new Map();
      for (const items of dto.items) {
        if (!uniqueItemsMap.has(items.product)) {
          uniqueItemsMap.set(items.product, items);
        }
      }

      const uniqueItems = Array.from(uniqueItemsMap.values());

      const cartItems = await this.prismaService.cart_items.createMany({
        data: uniqueItems.map((item) => ({
          user_id: user.sub,
          product_id: item.product,
          quantity: item.quantity,
        })),
        skipDuplicates: true,
      });

      return `Your cart has ${cartItems.count} products`;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
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

  async getCartItems(user: JwtUser) {
    const items = await this.prismaService.cart_items.findMany({
      where: { user_id: user.sub },
      include: {
        products: true,
      },
    });

    return {
      items: items.map((item) => ({
        product: item.products,
        quantity: item.quantity ?? 0,
      })),
    };
  }

  async createOrder(user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new Error('Only buyers can create orders.');
    }

    try {
      const cartItems = await this.prismaService.cart_items.findMany({
        where: {
          user_id: user.sub,
        },
        include: {
          products: true,
        },
      });

      if (cartItems.length === 0) {
        throw new HttpException('Cart is empty.', HttpStatus.BAD_REQUEST);
      }

      let totalPrice = 0;

      for (const item of cartItems) {
        if (!item.products) {
          throw new HttpException(
            `Product with ID ${item.product_id} not found.`,
            HttpStatus.BAD_REQUEST,
          );
        }
        totalPrice += item.products.price * (item.quantity ?? 0);
      }

      // Create Razorpay order
      const razorpayOrder = await this.razorpayService.createOrder(totalPrice);

      if (!razorpayOrder || !razorpayOrder.id) {
        throw new HttpException(
          'Failed to create Razorpay order',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(
        `Razorpay order created: ${razorpayOrder.id}`,
        razorpayOrder,
      );

      const orderId = uuidv4();

      const order = await this.prismaService.order.create({
        data: {
          id: orderId,
          user_id: user.sub,
          price: totalPrice,
          order_items: {
            create: cartItems.map((item) => ({
              quantity: item.quantity,
              products: {
                connect: { id: item.product_id },
              },
            })),
          },
          payment: {
            create: {
              gateway_order_id: razorpayOrder.id,
              details: JSON.parse(JSON.stringify(razorpayOrder))
            },
          },
        },
      });

      await this.prismaService.cart_items.deleteMany({
        where: {
          user_id: user.sub,
        },
      });

      return {
        message: 'order created successfully',
        order_id: order.id,
        total_price: order.price,
        razorpay_order_id: razorpayOrder.id,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Failed to create order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllOrders(user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new ForbiddenException('Only buyers can view their orders');
    }

    const orders = await this.prismaService.order.findMany({
      where: {
        user_id: user.sub,
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      createdAt: order.created_at,
      price: order.price,
      status: order.status,
      items: order.order_items.map((item) => ({
        product: item.products,
        quantity: item.quantity,
      })),
    }));
  }

  async findOneOrder(orderId: string, user: JwtUser) {
    if (user.user_type !== user_type.buyer) {
      throw new ForbiddenException('Only buyers can view their orders');
    }

    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        user_id: user.sub,
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: orderId,
      createdAt: order.created_at,
      price: order.price,
      status: order.status,
      items: order.order_items.map((item) => ({
        product: item.products,
        quantity: item.quantity,
      })),
    };
  }

  async updateOrderOnPaymentVerification(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    user: JwtUser,
  ) {
    const isValid = this.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      throw new HttpException(
        'Invalid payment signature',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedPayment = await this.prismaService.payment.update({
      where: {
        gateway_order_id: razorpayOrderId,
      },
      data: {
        payment_id: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });

    await this.prismaService.order.update({
      where: { id: updatedPayment.order_id, user_id: user.sub },
      data: { status: order_status.order_placed },
    });
    return { success: true, message: 'Payment verified successfully' };
  }

  private verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  }
}
