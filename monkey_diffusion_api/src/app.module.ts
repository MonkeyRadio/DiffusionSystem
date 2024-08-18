import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListenersModule } from './listeners/listeners.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsModule } from './stats/stats.module';
import { DiffusionModule } from './diffusion/diffusion.module';
import { MetadataModule } from './metadata/metadata.module';
import { RedisModule } from '@songkeys/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'redis',
      },
    }),
    ListenersModule,
    StatsModule,
    DiffusionModule,
    MetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
