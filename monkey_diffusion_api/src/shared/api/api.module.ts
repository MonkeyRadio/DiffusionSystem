import { Module } from '@nestjs/common';
import { AuthRepository } from './repositories/auth.repository';
import { ApiService } from './api.service';
import { RadiosRepository } from './repositories/radios.repository';

@Module({
  providers: [ApiService, AuthRepository, RadiosRepository],
  exports: [ApiService],
})
export class ApiModule {}
