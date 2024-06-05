import { Injectable } from '@nestjs/common';
import { ListenersDetails, ListenerState } from './types/Listeners';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import { DAYS_IN_MILLISECOND, MINUTES_IN_MILLISECOND } from 'src/utils/timeConstants';
import { Listener } from './listener';
import { Pagination } from 'src/pagination-param/pagination-param.decorator';
import { PaginatedReponse, paginatedResponse } from 'src/pagination-param/paginated-response';

@Injectable()
export class ListenersService {
  private listeners: Record<string, Listener> = {};

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  public getListeners(pagination: Pagination, onlyPlaying?: boolean): PaginatedReponse<Record<string, Listener>>{
    let paginatedListeners: Record<string, Listener> = {};
    let listeners = Object.entries(this.listeners);
    if (onlyPlaying) {
      listeners = listeners.filter(([_, listener]) => listener.getState() === ListenerState.PLAYING);
    }
    const start = pagination.page * pagination.limit;
    const end = start + pagination.limit;
    for (let i = start; i < end && i < listeners.length; i++) {
      paginatedListeners[listeners[i][0]] = listeners[i][1];
    }
    return paginatedResponse(paginatedListeners, listeners.length, pagination);
  }

  public getListener(id: string): Listener {
    if (!this.listeners[id]) {
      throw new Error('Listener not found');
    }
    return this.listeners[id];
  }

  private calculateNewListenerId(): string {
    do {
      const id = randomBytes(32).toString('hex');
      if (!this.listeners[id]) {
        return id;
      }
    } while (true);
  }

  public addListener(userAgent: string, listenersDetails?: ListenersDetails): { id: string; listener: Listener; } {
    if (listenersDetails?.webappUuid) {
      const listenerId = Object.keys(this.listeners).find(listenerId => this.listeners[listenerId]?.getListenersDetails()?.webappUuid === listenersDetails?.webappUuid);
      if (listenerId) {
        return {
          id: listenerId,
          listener: this.getListener(listenerId),
        };
      }
    }

    const listenerId = this.calculateNewListenerId();
    const listener = this.listeners[listenerId] = new Listener(userAgent, listenersDetails);
    return {
      id: listenerId,
      listener,
    };
  }

  public endListener(userAgent: string): void {
    this.getListener(userAgent).setState(ListenerState.ENDED);
  }

  private removeListener(userAgent: string): void {
    delete this.listeners[userAgent];
  }

  @Cron('* * * * *', {
    name: 'pruneListeners',
  })
  private pruneListeners(): void {
    const now = Date.now();
    for (const userAgent in this.listeners) {
      if (now - this.listeners[userAgent].getTimings().lastAction > DAYS_IN_MILLISECOND) {
        this.removeListener(userAgent);
      } else if (now - this.listeners[userAgent].getTimings().lastAction > 1 * MINUTES_IN_MILLISECOND) {
        this.listeners[userAgent].setState(ListenerState.IDLE);
      }
    }
  }
}
