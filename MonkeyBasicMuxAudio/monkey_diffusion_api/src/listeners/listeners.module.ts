import { Module } from '@nestjs/common';
import { ListenersService } from './listeners.service';
import { ListenersController } from './listeners.controller';

@Module({
  providers: [ListenersService],
  controllers: [ListenersController],
  exports: [ListenersService],
})
export class ListenersModule {}
