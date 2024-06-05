import { ListenersDetails, ListenerState, ListenerTimings } from "./types/Listeners"

export class Listener {
  private timings: ListenerTimings = {
    start: Date.now(),
    breaks: [],
    lastAction: Date.now(),
    totalListeningTime: 0,
  };
  private manifestId?: string;
  private state: ListenerState = ListenerState.INITIALIZING;

  constructor(
    private userAgent: string,
    private listenersDetails?: ListenersDetails
  ) {}

  public getTimings(): ListenerTimings {
    return this.timings;
  }

  private updateTotalListeningTime(): void {
    const breaksTime = this.timings.breaks.reduce((acc, { start, end }) => {
      if (end)
        acc += end - start;
      else
        acc += Date.now() - start;
      return acc;
    }, 0);
    this.timings.totalListeningTime = Date.now() - this.timings.start - breaksTime;
  }

  public updateTimings(): void {
    this.timings.lastAction = Date.now();
    this.updateTotalListeningTime();
  }

  public getManifestId(): string {
    if (!this.manifestId) {
      throw new Error('Manifest not set');
    }
    return this.manifestId;
  }

  public setManifestId(manifestId: string): void {
    if (this.manifestId && this.manifestId !== manifestId) {
      throw new Error('Manifest already set');
    }
    this.manifestId = manifestId;
  }

  public getState(): ListenerState {
    return this.state;
  }

  public startBreak(): void {
    this.timings.breaks.push({
      start: this.timings.lastAction,
    });
  }

  public endBreak(): void {
    if (this.timings.breaks.length === 0)
      return;
    const lastBreak = this.timings.breaks[this.timings.breaks.length - 1];
    lastBreak.end = Date.now();
  }

  public setState(state: ListenerState): void {
    if (state === ListenerState.PLAYING) {
      if (this.state === ListenerState.ENDED || this.state === ListenerState.IDLE)
        this.endBreak();
      this.updateTimings();
    } else if (state === ListenerState.IDLE || state === ListenerState.ENDED) {
      if (this.state === ListenerState.PLAYING || this.state === ListenerState.INITIALIZING)
        this.startBreak();
      this.updateTimings();
    } else if (state === ListenerState.INITIALIZING) {
      this.timings.start = Date.now();
      this.timings.breaks = [];
      this.timings.totalListeningTime = 0;
    }
    this.state = state;
  }

  public getListenersDetails(): ListenersDetails {
    return this.listenersDetails;
  }
}
