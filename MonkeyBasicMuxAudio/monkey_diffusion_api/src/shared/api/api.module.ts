import { Module } from '@nestjs/common';
import { AuthService } from './repositories/auth.service';
import { ApiService } from './api.service';
import { RadiosService } from './repositories/radios.service';

@Module({
  providers: [ApiService, AuthService, RadiosService],
  exports: [ApiService],
})
export class ApiModule {}
