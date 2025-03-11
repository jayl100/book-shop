import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { OrderDto } from './order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  async order(@Req() req: Request, @Res() res: Response) {
    const userId = req.user as number;
    if (!userId) {
      throw new UnauthorizedException('unauthorized');
    }

    const orderDto = req.body as OrderDto;
    await this.orderService.order(userId, orderDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Order created',
    });
  }

  @Delete()
  async deleteCartItems(@Body() items: number[]) {
    await this.orderService.deleteCartItems(items);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderDetails(
    @Param() id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user as number;
    if (!userId) {
      throw new UnauthorizedException('unauthorized');
    }

    const orderId = Number(id);
    await this.orderService.getOrderDetails(orderId);

    return res.status(HttpStatus.CREATED).json({
      message: 'Success get to order details',
    });
  }
}
