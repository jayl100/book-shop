import {
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeeService: LikeService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  async addLike(
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

    await this.likeeService.addLike(userId, id);

    return res.status(HttpStatus.CREATED).json({
      message: 'Like added successfully.',
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteLike(
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

    await this.likeeService.removeLike(userId, id);

    return res.status(HttpStatus.CREATED).json({
      message: 'Like deleted successfully.',
    });
  }
}
