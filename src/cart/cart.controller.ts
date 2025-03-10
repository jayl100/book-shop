import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response, Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addCart(@Req() req: Request, @Res() res: Response) {
    const id = req.user as number;
    const { bookId, quantity } = req.body;

    if (!id) {
      throw new UnauthorizedException('unauthorized');
    }

    if (!bookId || !quantity) {
      throw new BadRequestException('bookId and quantity is required');
    }

    await this.cartService.addToCart(bookId, quantity, id);

    return res.status(HttpStatus.CREATED).json({
      message: 'Success added to cart',
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCartItem(@Req() req: Request, @Res() res: Response) {
    const userId = req.user as number;
    const { selected } = req.body;

    if (!userId) {
      throw new UnauthorizedException('unauthorized');
    }

    if (!selected) {
      throw new BadRequestException('Please select');
    }

    const data = await this.cartService.getCartItem(selected, userId);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Success get to cart', data: data });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user as number;

    if (!userId) {
      throw new UnauthorizedException('unauthorized');
    }

    if (!id) {
      throw new NotFoundException('Not found page');
    }

    await this.cartService.removeFromCart(id, userId);

    return res.status(HttpStatus.OK).json({
      message: 'Success removed from cart',
    });
  }
}
