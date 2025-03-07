import {
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './auth.dto';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async getUsers() {
    return this.authService.getAllUsers();
  }

  @Post('signup')
  async createUser(@Req() req: Request, @Res() res: Response) {
    const authDto = req.body as AuthDto;
    if (!authDto) {
      throw new ConflictException('email and password are required');
    }

    await this.authService.createUser(authDto);

    return res.status(HttpStatus.CREATED).json({
      massage: `hello ${authDto.email}. thank you for signing up for our service.`,
    });
  }

  @Post('login')
  async loginUser(@Req() req: Request, @Res() res: Response) {
    const authDto = req.body as AuthDto;
    if (!authDto) {
      throw new ConflictException('email and password are required');
    }

    await this.authService.loginUser(authDto);
    return res
      .status(HttpStatus.OK)
      .json({ message: `hello ${authDto.email}` });
  }
}
