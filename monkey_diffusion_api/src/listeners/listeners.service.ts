import { Injectable } from '@nestjs/common';
import { ListenersDetails, ListenerState } from './types/Listeners';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import {
  DAYS_IN_MILLISECOND,
  MINUTES_IN_MILLISECOND,
} from 'src/utils/timeConstants';
import { Listener } from './listener';
import { Pagination } from 'src/pagination-param/pagination-param.decorator';
import { paginatedResponse } from 'src/pagination-param/paginated-response';
import { UserModel } from '@/shared/api/models/user.model';

@Injectable()
export class ListenersService {
  private listeners: Record<string, Listener> = {};

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  private toArray(listeners: Record<string, Listener>) {
    return Object.entries(listeners).map(([, listener]) => listener);
  }

  private filterListeners(
    listeners: Record<string, Listener>,
    opts?: {
      onlyPlaying?: boolean;
      user?: UserModel;
      manifestId?: string;
    },
  ): Record<string, Listener> {
    return Object.entries(listeners).reduce((acc, [, listener]) => {
      if (opts?.onlyPlaying && listener.getState() !== ListenerState.PLAYING) {
        return acc;
      }
      if (
        (opts?.manifestId && listener.getManifestId() !== opts.manifestId) ||
        (opts?.user &&
          !opts.user.scopes.some((scope) =>
            scope.includes(listener.getManifestId()),
          ))
      ) {
        return acc;
      }
      return {
        ...acc,
        [listener.getId()]: listener,
      };
    }, {});
  }

  public toPaginatedResponse(pagination: Pagination, onlyPlaying: boolean) {
    const listeners = this.filterListeners(this.listeners, { onlyPlaying });
    const listenersArray = this.toArray(listeners);
    return paginatedResponse(listenersArray, listenersArray.length, pagination);
  }

  public getListenersCount(radioId: string, manifestId?: string[]): number {
    return Object.values(this.listeners)
      .filter((listener) => listener.radioId === radioId)
      .filter(
        (listener) =>
          !manifestId || manifestId.includes(listener.getManifestId()),
      ).length;
  }

  public getPlayingListenersCount(
    radioId: string,
    manifestId?: string[],
  ): number {
    return Object.values(this.listeners)
      .filter((listener) => listener.radioId === radioId)
      .filter(
        (listener) =>
          !manifestId || manifestId.includes(listener.getManifestId()),
      )
      .filter((listener) => listener.getState() === ListenerState.PLAYING)
      .length;
  }

  public getDayUniqueListenersCount(
    radioId: string,
    manifestId?: string[],
  ): number {
    return Object.values(this.listeners)
      .filter((listener) => listener.radioId === radioId)
      .filter(
        (listener) =>
          !manifestId || manifestId.includes(listener.getManifestId()),
      )
      .filter(
        (listener) =>
          listener.getTimings().lastAction > Date.now() - DAYS_IN_MILLISECOND,
      ).length;
  }

  public getDayListenersCount(radioId: string, manifestId?: string[]): number {
    const uniquePlayers = Object.values(this.listeners)
      .filter((listener) => listener.radioId === radioId)
      .filter(
        (listener) =>
          !manifestId || manifestId.includes(listener.getManifestId()),
      )
      .filter(
        (listener) =>
          listener.getTimings().lastAction > Date.now() - DAYS_IN_MILLISECOND,
      );
    let count = uniquePlayers.length;
    for (const listener of uniquePlayers) {
      if (listener.getTimings().breaks.length > 0)
        count += listener.getTimings().breaks.length - 1;
    }
    return count;
  }

  public getDayListeningTime(radioId: string, manifestId?: string[]): number {
    return Object.values(this.listeners)
      .filter((listener) => listener.radioId === radioId)
      .filter(
        (listener) =>
          !manifestId || manifestId.includes(listener.getManifestId()),
      )
      .reduce((acc, listener) => {
        if (
          listener.getTimings().lastAction >
          Date.now() - DAYS_IN_MILLISECOND
        ) {
          acc += listener.getTimings().totalListeningTime;
        }
        return acc;
      }, 0);
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

  public addListener(
    radioId: string,
    userAgent: string,
    listenersDetails?: ListenersDetails,
  ): { id: string; listener: Listener } {
    if (listenersDetails?.webappUuid) {
      const listenerId = Object.keys(this.listeners).find(
        (listenerId) =>
          this.listeners[listenerId]?.getListenersDetails()?.webappUuid ===
          listenersDetails?.webappUuid,
      );
      if (listenerId) {
        return {
          id: listenerId,
          listener: this.getListener(listenerId),
        };
      }
    }

    const listenerId = this.calculateNewListenerId();
    const listener = (this.listeners[listenerId] = new Listener(
      listenerId,
      radioId,
      userAgent,
      listenersDetails,
    ));
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
      if (
        now - this.listeners[userAgent].getTimings().lastAction >
        DAYS_IN_MILLISECOND
      ) {
        this.removeListener(userAgent);
      } else if (
        now - this.listeners[userAgent].getTimings().lastAction >
        1 * MINUTES_IN_MILLISECOND
      ) {
        this.listeners[userAgent].setState(ListenerState.IDLE);
      }
    }
  }
}
