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

  async loginUser(authDto: AuthDto) {
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

    return matchUser;
  }
}
