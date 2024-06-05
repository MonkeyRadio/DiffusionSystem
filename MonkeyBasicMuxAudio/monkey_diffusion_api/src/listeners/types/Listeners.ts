export enum ListenerState {
  INITIALIZING = 'INITIALIZING',
  PLAYING = 'PLAYING',
  IDLE = 'IDLE',
  ENDED = 'ENDED',
}

export type ListenerTimings = {
  start: number;
  breaks: {
    start: number;
    end?: number;
  }[];
  lastAction: number;
  totalListeningTime: number;
}

export type ListenersDetails = {
  webappUuid?: string;
}
