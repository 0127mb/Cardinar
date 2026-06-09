import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../entities/otp/otp.entity';
import { User } from '../entities/user/user.entity'; 
import { Repository } from 'typeorm';

@Injectable()
export class OtpRateLimitGuard {
  private readonly store = new Map<
    string,
    { count: number; firstRequest: Date; blockedUntil?: Date }
  >();

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async CanActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.headers['x-forwarded-for'];
    const email = request.body?.email;
    const key = `${ip}_${email}`;
    const now = new Date();
    const entry = this.store.get(key);
    if (entry?.blockedUntil && entry.blockedUntil > now) {
      const minutesLeft = Math.ceil(
        (entry.blockedUntil.getTime() - now.getTime()) / 60000,
      );
      throw new HttpException(
        `Too many attempts. Your IP is blocked for ${minutesLeft} more minutes.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (!entry || now.getTime() - entry.firstRequest.getTime() > 3600000) {
      this.store.set(key, { count: 1, firstRequest: now });
      return true;
    }
    entry.count += 1;
    if (entry.count > 2) {
      const blockUntil = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      entry.blockedUntil = blockUntil;
      throw new HttpException(
        'Too many OTP requests. Your IP is blocked for 5 hours.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    this.store.set(key, entry);
    return true;
  }
}
