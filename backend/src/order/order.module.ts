import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderService } from "./order.services";
import { RazorpayService } from "src/razorpay";


@Module({
    controllers: [OrderController],
    providers: [OrderService, PrismaService, RazorpayService],
})
export class OrderModule {}