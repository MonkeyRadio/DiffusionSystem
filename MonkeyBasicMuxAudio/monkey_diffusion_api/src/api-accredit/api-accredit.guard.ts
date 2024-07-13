import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiService } from '@/shared/api/api.service';
import { UserRole } from '@/shared/api/enums/user-role.enum';

@Injectable()
export class ApiAccreditGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly apiService: ApiService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roleName = this.reflector.get<UserRole>(
        'roleName',
        context.getHandler(),
      );
      const scopeName = this.reflector.get<string>(
        'scopeName',
        context.getHandler(),
      );
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) return false;
      const user = await this.apiService.auth.me(token);
      request.user = user;
      if (!user.hasRole(roleName) || !user.hasScope(scopeName)) return false;
      request.radios = await this.apiService.radio.list(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
