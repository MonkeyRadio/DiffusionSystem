import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { MustBe } from '@/api-accredit/decorators/must-be.decorator';
import { UserRole } from '@/shared/api/enums/user-role.enum';
import { ApiAccreditGuard } from '@/api-accredit/api-accredit.guard';
import { StatsListenersResponse } from './responses/stats-listeners.response';
import { Radios } from '@/api-accredit/decorators/radios.decorator';
import { RadioModel } from '@/shared/api/models/radio.model';
import { RequiredPipe } from '@/shared/pipes/required.pipe';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @MustBe(UserRole.StatsViewer)
  @UseGuards(ApiAccreditGuard)
  @Get(':radioId/listeners')
  public listeners(
    @Radios() userRadios: RadioModel[],
    @Param('radioId') radioId: string,
    @Query('manifestId', RequiredPipe) manifestId: string,
    @Query('onlyLive', new DefaultValuePipe(false), ParseBoolPipe)
    onlyLive: boolean,
  ): StatsListenersResponse {
    const radio = userRadios.find((radio) => radio.id === radioId);
    if (!radio) throw new NotFoundException('Radio not found');
    if (radio.liveStream.find((liveStream) => liveStream.name === manifestId))
      return this.statsService.listeners(radio.id, [manifestId]);
    return this.statsService.listeners(
      radio.id,
      radio.liveStream
        .filter((liveStream) => !onlyLive || liveStream.onDemand === false)
        .map((liveStream) => liveStream.name),
    );
  }
}
