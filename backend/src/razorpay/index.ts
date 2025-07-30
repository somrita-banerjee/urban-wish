import { Injectable, Module } from '@nestjs/common';import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amountInInr: number) {
    const options = {
      amount: amountInInr * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await this.razorpay.orders.create(options);

    return order;
  }
}

@Module({
  providers: [RazorpayService],
  exports: [RazorpayService],
})
export class RazorpayModule {}
