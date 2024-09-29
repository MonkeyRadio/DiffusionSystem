export type MetadataRequest = {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  duration: number;
  imageUrl: string;
  trackNumber?: number;
  tsPosted: number;
  comment: MetadataComment;
};

export enum MetadataType {
  SINGLE = 'single',
  MEDIAMASK = 'mediamask',
  SHOW = 'show',
  DJSET = 'djset',
}

export type MetadataComment = {
  internalId: string;
  type: MetadataType;
  video: boolean;
  displayMetadata: boolean;
  tsUpdated: number;
  duration: number;
};
