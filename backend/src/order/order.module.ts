import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderService } from "./order.services";


@Module({
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
})
export class OrderModule {}