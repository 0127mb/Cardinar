import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';

type RequestWithCookies = {
  cookies?: {
    access_token?: string;
  };
};

const cookieExtractor = (request?: RequestWithCookies): string | null => {
  return request?.cookies?.access_token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  async validate(payload: {
    sub: number;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
  }) {
    const user = await this.user.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('user not registrated');
    }
    return user;
  }
}
