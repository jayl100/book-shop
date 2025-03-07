import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
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

    const token = await this.authService.loginUser(authDto);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    return (
      res
        .status(HttpStatus.OK)
        // .header('Authorization', 'Bearer ' + token)
        .cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3 * 60 * 60 * 1000, // 3시간
        })
        .json({ message: `hello ${authDto.email} - ${token}` })
    );
  }

  @Post('reset')
  async passwordResetRequest(@Body('email') email: string) {
    if (!email) {
      throw new ConflictException('email required');
    }
    await this.authService.passwordResetRequest(email);
  }

  @Put('reset')
  async passwordReset(@Body() authDto: AuthDto, @Res() res: Response) {
    if (!authDto) {
      throw new ConflictException('email and password are required');
    }
    await this.authService.passwordReset(authDto);

    return res.status(HttpStatus.OK).json({
      message: `reset password is successful`,
    });
  }
}
