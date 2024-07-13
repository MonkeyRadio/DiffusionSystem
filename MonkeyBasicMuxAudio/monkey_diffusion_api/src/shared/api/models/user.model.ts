import { UserRole } from '../enums/user-role.enum';

export class UserModel {
  id: number;
  nickname: string;
  email: string;
  roles: UserRole[];
  scopes: string[];

  constructor(user: UserModel) {
    Object.assign(this, user);
  }

  public hasRole(role: UserRole): boolean {
    return (
      !role ||
      this.roles.includes(role) ||
      this.roles.includes(UserRole.Administrator)
    );
  }

  public hasScope(scope: string): boolean {
    return !scope || this.scopes.includes(scope) || this.scopes.includes('*');
  }
}
