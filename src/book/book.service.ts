import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookDto, GetBookQueryDto, Pagination } from './book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(query: GetBookQueryDto): Promise<{
    books: BookDto[];
    pagination?: Pagination;
  }> {
    const defaultLimit = 10;
    const defaultPage = 1;
    const {
      categoryId,
      newly,
      limit = defaultLimit,
      currentPage = defaultPage,
    } = query;

    const filter = this.buildBookFilter(categoryId, newly);
    const offset = limit * (currentPage - 1);

    const [books, totalCount] = await Promise.all([
      this.prisma.book.findMany({
        where: filter,
        skip: offset,
        take: limit,
        orderBy: { pub_date: 'desc' },
      }),
      this.prisma.book.count({ where: filter }),
    ]);

    const pagination = {
      current_page: currentPage,
      total_count: totalCount,
      total_pages: Math.ceil(totalCount / limit),
    };

    return { books, pagination };
  }

  async getBookDetails(id: string): Promise<BookDto> {
    const bookId = Number(id);

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  buildBookFilter(categoryId?: string, newly?: boolean) {
    const intCategoryId = Number(categoryId);
    const filter: {
      category_id?: number;
      pub_date?: { gte: Date; lte: Date };
    } = {};
    if (categoryId) {
      filter.category_id = intCategoryId;
    }
    if (newly) {
      const timeOffset = new Date().getTimezoneOffset() * 60000;
      const now = new Date(Date.now() - timeOffset);
      const oneMonthAgo = new Date(new Date(now.setMonth(now.getMonth() - 1)));

      filter.pub_date = {
        gte: now,
        lte: oneMonthAgo,
      };
    }

    return filter;
  }
}
