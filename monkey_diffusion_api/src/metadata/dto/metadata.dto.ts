import { MetadataType } from '@/shared/liquidsoap-api/requests/metadata.request';

export class MetadataDto {
  internalId?: string;
  type: MetadataType;
  video: boolean;
  displayMetadata: boolean;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  duration: number;
  trackNumber?: number;
  tsPosted: number;
  tsUpdated: number;
}
