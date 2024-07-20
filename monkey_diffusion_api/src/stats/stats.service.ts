import { ListenersService } from '@/listeners/listeners.service';
import { Injectable } from '@nestjs/common';
import { StatsListenersResponse } from './responses/stats-listeners.response';

@Injectable()
export class StatsService {
  public constructor(private readonly listenersService: ListenersService) {}

  public listeners(
    radioId: string,
    manifestId: string[],
  ): StatsListenersResponse {
    const listenersCount = this.listenersService.getListenersCount(
      radioId,
      manifestId,
    );
    const dayListeningTime = this.listenersService.getDayListeningTime(
      radioId,
      manifestId,
    );
    return {
      nb_playing_listeners: this.listenersService.getPlayingListenersCount(
        radioId,
        manifestId,
      ),
      day_listeners: this.listenersService.getDayListenersCount(
        radioId,
        manifestId,
      ),
      day_unique_listeners: this.listenersService.getDayUniqueListenersCount(
        radioId,
        manifestId,
      ),
      day_listening_time: dayListeningTime,
      day_listening_time_avg:
        listenersCount > 0 ? dayListeningTime / listenersCount : 0,
    };
  }
}
