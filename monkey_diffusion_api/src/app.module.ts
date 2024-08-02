import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListenersModule } from './listeners/listeners.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from './stats/stats.module';
import { DiffusionModule } from './diffusion/diffusion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ListenersModule,
    StatsModule,
    DiffusionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
