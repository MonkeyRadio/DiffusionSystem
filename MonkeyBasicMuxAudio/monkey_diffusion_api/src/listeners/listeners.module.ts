import { Module } from '@nestjs/common';
import { ListenersService } from './listeners.service';

@Module({
  providers: [ListenersService]
})
export class ListenersModule {}
