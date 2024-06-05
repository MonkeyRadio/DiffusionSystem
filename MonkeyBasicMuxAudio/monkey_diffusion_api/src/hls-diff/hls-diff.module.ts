import { Module } from '@nestjs/common';
import { HlsDiffService } from './hls-diff.service';
import { HlsDiffController } from './hls-diff.controller';
import { ListenersService } from 'src/listeners/listeners.service';

@Module({
  controllers: [HlsDiffController],
  providers: [HlsDiffService, ListenersService],
})
export class HlsDiffModule {}
