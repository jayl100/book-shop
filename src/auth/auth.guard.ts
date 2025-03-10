import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('올바른 토큰의 형식이 아닙니다.');
    }

    const user = await this.prisma.token.findUnique({
      where: { token },
    });
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    request.user = user.user_id;

    return true;
  }
}
