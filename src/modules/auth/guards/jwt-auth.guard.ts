import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add custom logic here if needed
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Custom error handling for JWT authentication
    if (err || !user) {
      const errorMessage = err?.message || info?.message || 'Authentication failed';

      if (errorMessage.includes('jwt expired')) {
        throw new UnauthorizedException('Token has expired');
      }

      if (errorMessage.includes('invalid signature')) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      if (errorMessage.includes('jwt malformed')) {
        throw new UnauthorizedException('Malformed authentication token');
      }

      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }
}
