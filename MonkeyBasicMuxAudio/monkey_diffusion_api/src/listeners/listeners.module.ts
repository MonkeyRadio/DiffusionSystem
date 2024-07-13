import { Module } from '@nestjs/common';
import { ListenersService } from './listeners.service';
import { ListenersController } from './listeners.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ListenersService],
  controllers: [ListenersController],
  exports: [ListenersService],
})
export class ListenersModule {}
