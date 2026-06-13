import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RemoveEmailAndOtp1781347200000 } from './migrations/1781347200000-remove-email-and-otp';

function requiresSsl(databaseUrl: string): boolean {
  const url = new URL(databaseUrl);

  return url.hostname.endsWith('.neon.tech') || url.searchParams.has('sslmode');
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DB_URL');
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        if (!databaseUrl) {
          throw new Error(
            'Database configuration is missing. Set the DB_URL environment variable.',
          );
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          ssl: requiresSsl(databaseUrl)
            ? { rejectUnauthorized: false }
            : undefined,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          migrations: [RemoveEmailAndOtp1781347200000],
          migrationsRun: true,
          synchronize:
            config.get<string>(
              'DB_SYNCHRONIZE',
              isProduction ? 'false' : 'true',
            ) === 'true',
          logging: config.get<string>('DB_LOGGING', 'false') === 'true',
        } as const;
      },
    }),
  ],
})
export class DatabaseModule {}
