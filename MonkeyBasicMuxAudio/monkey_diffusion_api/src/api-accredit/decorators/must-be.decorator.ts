import { UserRole } from '@/shared/api/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const MustBe = (roleName: UserRole) => SetMetadata('roleName', roleName);
