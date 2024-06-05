import { ListenersDetails, ListenerState, ListenerTimings } from "./types/Listeners"

export class Listener {
  private timings: ListenerTimings = {
    start: Date.now(),
    lastAction: Date.now(),
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

  public updateTimings(): void {
    this.timings.lastAction = Date.now();
  }

  public getManifestId(): string {
    if (!this.manifestId) {
      throw new Error('Manifest not set');
    }
    return this.manifestId;
  }

  public setManifestId(manifestId: string): void {
    if (this.manifestId) {
      throw new Error('Manifest already set');
    }
    this.manifestId = manifestId;
  }

  public getState(): ListenerState {
    return this.state;
  }

  public setState(state: ListenerState): void {
    this.state = state;
  }

  public getListenersDetails(): ListenersDetails {
    return this.listenersDetails;
  }
}
