import { SetMetadata } from '@nestjs/common';

export const MustHaveScope = (scopeName: string) =>
  SetMetadata('scopeName', scopeName);
