import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(bookId: number, quantity: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.prisma.cartItem.create({
      data: {
        book_id: book.id,
        title: book.title,
        summary: book.summary,
        price: book.price,
        quantity,
        user_id: userId,
      },
    });
  }

  async getCartItem(selected: number, userId: number) {
    if (selected) {
      const selectedCart = await this.prisma.cartItem.findMany({
        where: { id: selected, user_id: userId },
      });
      return selectedCart;
    }
  }

  removeFromCart(id: string, userId: number) {
    const intId = Number(id);

    return this.prisma.cartItem.delete({
      where: { id: intId, user_id: userId },
    });
  }
}
