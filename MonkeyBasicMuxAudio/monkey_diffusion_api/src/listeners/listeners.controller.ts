import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ListenersService } from './listeners.service';
import { BasicAuthTokenGuard } from 'src/basic-auth-token/basic-auth-token.guard';
import { Pagination, PaginationParams } from 'src/pagination-param/pagination-param.decorator';

@Controller('listeners')
export class ListenersController {
  constructor(private readonly listenersService: ListenersService) {}

  @UseGuards(BasicAuthTokenGuard)
  @Get()
  getListeners(@PaginationParams() paginationParams: Pagination, @Query('onlyPlaying') onlyPlaying: boolean) {
    return this.listenersService.getListeners(paginationParams, onlyPlaying);
  }
}
