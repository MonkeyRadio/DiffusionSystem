import { Module } from '@nestjs/common';
import { HlsModule } from './hls/hls.module';

@Module({
  imports: [HlsModule],
})
export class DiffusionModule {}
