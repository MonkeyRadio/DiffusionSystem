export enum ListenerState {
  INITIALIZING = 'INITIALIZING',
  PLAYING = 'PLAYING',
  IDLE = 'IDLE',
  ENDED = 'ENDED',
}

export type ListenerTimings = {
  start: number;
  lastAction: number;
}

export type ListenersDetails = {
  webappUuid?: string;
}
