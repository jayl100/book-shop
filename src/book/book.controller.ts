import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto, GetBookQueryDto, Pagination } from './book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(
    @Query() query: GetBookQueryDto,
  ): Promise<{ books: BookDto[]; pagination?: Pagination }> {
    return await this.bookService.getAllBooks(query);
  }

  @Get(':id')
  async getBookDetails(@Param('id') id: string): Promise<BookDto> {
    if (!id) {
      throw new NotFoundException('Not Found Page');
    }
    return await this.bookService.getBookDetails(id);
  }
}
