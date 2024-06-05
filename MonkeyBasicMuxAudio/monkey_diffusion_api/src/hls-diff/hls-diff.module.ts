import { Module } from '@nestjs/common';
import { HlsDiffService } from './hls-diff.service';
import { HlsDiffController } from './hls-diff.controller';
import { ListenersModule } from 'src/listeners/listeners.module';

@Module({
  controllers: [HlsDiffController],
  providers: [HlsDiffService],
  imports: [
    ListenersModule,
  ]
})
export class HlsDiffModule {}
