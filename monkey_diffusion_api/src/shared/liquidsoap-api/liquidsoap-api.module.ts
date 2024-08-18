import { Module } from '@nestjs/common';
import { LiquidsoapApiService } from './liquidsoap-api.service';
import { MetadataRepository } from './repositories/metadata.repository';

@Module({
  providers: [LiquidsoapApiService, MetadataRepository],
  exports: [LiquidsoapApiService],
})
export class LiquidsoapApiModule {}
