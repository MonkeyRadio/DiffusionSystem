import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListenersService } from './listeners.service';
import {
  Pagination,
  PaginationParams,
} from 'src/pagination-param/pagination-param.decorator';
import { MustBe } from 'src/api-accredit/decorators/must-be.decorator';
import { ApiAccreditGuard } from 'src/api-accredit/api-accredit.guard';
import { UserRole } from '@/shared/api/enums/user-role.enum';

@Controller('listeners')
export class ListenersController {
  constructor(private readonly listenersService: ListenersService) {}

  @MustBe(UserRole.StatsViewer)
  @UseGuards(ApiAccreditGuard)
  @Get()
  getListeners(
    @PaginationParams() paginationParams: Pagination,
    @Query('onlyPlaying', new DefaultValuePipe(false), ParseBoolPipe)
    onlyPlaying: boolean,
  ) {
    return this.listenersService.toPaginatedResponse(
      paginationParams,
      onlyPlaying,
    );
  }
}
