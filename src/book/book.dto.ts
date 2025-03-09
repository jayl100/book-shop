import { IsOptional, IsNumber } from 'class-validator';

export class BookDto {
  id: number;
  title: string;
  img: number;
  category_id: number;
  format: string;
  isbn: number;
  summary: string;
  author: string;
  pages: number;
  contents: string;
  price: number;
  pub_date: Date;
  likes: number;
}

export class GetBookQueryDto {
  @IsOptional()
  @IsNumber()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  newly?: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  currentPage?: number;
}

export class Pagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}
