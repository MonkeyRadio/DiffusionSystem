import { Module } from '@nestjs/common';
import { IceModule } from './ice/ice.module';
import { HlsModule } from './hls/hls.module';
import { HlsController } from './hls/hls.controller';
import { IceController } from './ice/ice.controller';

@Module({
  imports: [
    HlsModule,
    IceModule
  ]
})
export class DiffusionModule {}
