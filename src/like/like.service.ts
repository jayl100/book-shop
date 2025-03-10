import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async addLike(userId: number, id: string) {
    const bookId = Number(id);

    const likeExist = await this.prisma.like.findFirst({
      where: { liked_book_id: bookId },
    });

    if (!likeExist) {
      throw new ConflictException('이미 좋아요를 누르셨습니다.');
    }

    await this.prisma.like.create({
      data: {
        liked_book_id: bookId,
        user_id: userId,
      },
    });
  }

  async removeLike(userId: number, id: string) {
    const bookId = Number(id);

    const likeExist = await this.prisma.like.findFirst({
      where: {
        liked_book_id: bookId,
        user_id: userId,
      },
    });

    if (!likeExist) {
      throw new NotFoundException("can't find like exist");
    }

    await this.prisma.like.delete({
      where: {
        liked_book_id: bookId,
        user_id: userId,
      },
    });
  }
}
