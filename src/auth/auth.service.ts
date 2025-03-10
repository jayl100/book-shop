import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(authDto: AuthDto) {
    if (!authDto) return null;
    const { email, password } = authDto;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });
    }

    return user;
  }

  async loginUser(authDto: AuthDto): Promise<string> {
    const { email, password } = authDto;

    const matchUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!matchUser) {
      throw new ConflictException('Does not exist');
    }

    const comparePassword = await bcrypt.compare(password, matchUser.password);
    if (!comparePassword) {
      throw new ConflictException('Login failed');
    }

    const token = this.generateAccessToken(matchUser.id, email);
    console.log(token);

    await this.prisma.token.create({
      data: {
        token,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
        user_id: matchUser.id,
      },
    });

    return token;
  }

  passwordResetRequest(email: string) {
    console.log(email);
    return this.prisma.user.findUnique({ where: { email } });
  }

  async passwordReset(authDto: AuthDto) {
    const { email, password } = authDto;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  generateAccessToken(sub: number, email: string) {
    const token = this.jwtService.sign({
      sub,
      email,
    });
    return token;
  }
}
