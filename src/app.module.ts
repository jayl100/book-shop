import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { BookService } from './book/book.service';
import { BookController } from './book/book.controller';
import { BookModule } from './book/book.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { LikeController } from './like/like.controller';
import { LikeService } from './like/like.service';
import { LikeModule } from './like/like.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BookModule,
    CartModule,
    CategoryModule,
    LikeModule,
    OrderModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController, BookController, LikeController],
  providers: [
    ConfigService,
    AppService,
    PrismaService,
    BookService,
    LikeService,
  ],
})
export class AppModule {}
