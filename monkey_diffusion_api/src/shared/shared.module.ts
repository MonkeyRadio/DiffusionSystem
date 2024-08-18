import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { LiquidsoapApiModule } from './liquidsoap-api/liquidsoap-api.module';

@Module({
  imports: [ApiModule, LiquidsoapApiModule],
  exports: [ApiModule, LiquidsoapApiModule],
})
export class SharedModule {}
