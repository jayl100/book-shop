import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async order(userId: number, orderDto: OrderDto) {
    const { items, delivery, total_quantity, total_price, first_book_title } =
      orderDto;
    const { address, receiver, contact } = delivery;

    const createDelivery = await this.prisma.delivery.create({
      data: {
        address,
        receiver,
        contact,
      },
    });
    const deliveryId = createDelivery.id;

    const createOrder = await this.prisma.order.create({
      data: {
        book_title: first_book_title,
        total_quantity,
        total_price,
        user_id: userId,
        delivery_id: deliveryId,
      },
    });
    const orderId = createOrder.id;

    const orderItems = await this.prisma.cartItem.findMany({
      where: { id: { in: items } },
    });

    orderItems.forEach((orderItem) => {
      return this.prisma.orderedBook.createMany({
        data: [
          {
            order_id: orderId,
            book_id: orderItem.id,
            quantity: orderItem.quantity,
          },
        ],
      });
    });
    await this.deleteCartItems(items);
  }

  async deleteCartItems(items: number[]) {
    return this.prisma.cartItem.deleteMany({
      where: { id: { in: items } },
    });
  }

  async getOrderDetails(orderId: number) {
    const orderedBookId = await this.prisma.orderedBook.findMany({
      where: { order_id: orderId },
      select: {
        book_id: true,
        books: {
          select: {
            title: true,
            author: true,
            price: true,
          },
        },
      },
    });

    return orderedBookId;
  }
}
