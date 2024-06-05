import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const EnvToken = this.configService.get<string>('DIFFUSION_API_BASIC_AUTH_TOKEN');
    if (!EnvToken)
      return false;
    if (EnvToken === 'INSECURE-NOAUTH')
      return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    return token === `Bearer ${EnvToken}`;
  }
}
