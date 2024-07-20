import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SharedModule } from '@/shared/shared.module';
import { ListenersModule } from '@/listeners/listeners.module';

@Module({
  imports: [SharedModule, ListenersModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
