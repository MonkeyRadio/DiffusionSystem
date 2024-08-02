import { Module } from '@nestjs/common';
import { HlsService } from './hls.service';
import { HlsController } from './hls.controller';
import { ListenersModule } from 'src/listeners/listeners.module';

@Module({
  controllers: [HlsController],
  providers: [HlsService],
  imports: [ListenersModule],
})
export class HlsModule {}
