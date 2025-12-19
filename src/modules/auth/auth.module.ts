import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Infrastructure dependencies
import { MysqlModule } from '../../infrastructure/database/mysql.module';
import { RedisModule } from '../../infrastructure/cache/redis.module';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    // Infrastructure modules
    MysqlModule,
    RedisModule,

    // Passport and JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || 24 * 60 * 60,
      },
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
