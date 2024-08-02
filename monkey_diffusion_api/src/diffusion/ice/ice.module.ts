import { Module } from '@nestjs/common';
import { IceService } from './ice.service';
import { IceController } from './ice.controller';

@Module({
  controllers: [IceController],
  providers: [IceService],
})
export class IceModule {}
