import { Controller, Get } from '@nestjs/common';
import { IceService } from './ice.service';

@Controller('diffusion/ice')
export class IceController {
  constructor(private readonly iceService: IceService) {}

  @Get()
  getIce(): string {
    return 'Hello from IceController!';
  }
}
