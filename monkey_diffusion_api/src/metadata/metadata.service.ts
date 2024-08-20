import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { PostMetadataDto } from './dto/post-metadata.dto';
import { MetadataDto } from './dto/metadata.dto';
import { LiquidsoapApiService } from '@/shared/liquidsoap-api/liquidsoap-api.service';
import { MetadataRequest } from '@/shared/liquidsoap-api/requests/metadata.request';
import { PutMetadataDto } from './dto/put-metadata.dto';

@Injectable()
export class MetadataService {
  public constructor(
    @InjectRedis() private readonly redisService: Redis,
    private readonly liquidsoapApiService: LiquidsoapApiService,
  ) {}

  public async current(
    radioId: string,
    manifestId: string,
  ): Promise<MetadataDto> {
    const meta = await this.redisService.get(
      `metadata:${radioId}:${manifestId}`,
    );
    if (!meta) {
      throw new Error('Metadata not found');
    }
    return JSON.parse(meta);
  }

  private async dispatchToLiquidsoap(
    radioId: string,
    contentId: string,
    metadata: MetadataDto,
  ) {
    const strRegex = /[^a-zA-Z0-9()éèêàâ\-_ .']/g;
    const metadataRequest: MetadataRequest = {
      title: metadata.title.replace(strRegex, ''),
      artist: metadata.artist.replace(strRegex, ''),
      album: metadata.album ? metadata.album.replace(strRegex, '') : '',
      year: metadata.year,
      trackNumber: metadata.trackNumber,
      duration: metadata.duration,
      tsPosted: metadata.tsPosted,
      comment: {
        internalId: metadata.internalId.replace(strRegex, ''),
        type: metadata.type,
        video: metadata.video,
        displayMetadata: metadata.displayMetadata,
        tsUpdated: metadata.tsUpdated,
        duration: metadata.duration,
      },
    };

    return this.liquidsoapApiService.metadata.dispatch(
      radioId,
      contentId,
      metadataRequest,
    );
  }

  public async postCurrent(
    radioId: string,
    contentId: string,
    postMetadata: PostMetadataDto,
  ) {
    const metadata: MetadataDto = {
      ...postMetadata,
      tsPosted: Date.now(),
      tsUpdated: Date.now(),
    };
    await this.redisService.set(
      `metadata:${radioId}:${contentId}`,
      JSON.stringify(metadata),
    );
    const current = await this.current(radioId, contentId);
    this.dispatchToLiquidsoap(radioId, contentId, current).catch(() => {});
    return metadata;
  }

  public async updateCurrent(
    radioId: string,
    contentId: string,
    putMetadata: PutMetadataDto,
  ) {
    const oldMeta = await this.current(radioId, contentId);
    const metadata: MetadataDto = {
      ...oldMeta,
      ...putMetadata,
      tsUpdated: Date.now(),
    };
    await this.redisService.set(
      `metadata:${radioId}:${contentId}`,
      JSON.stringify(metadata),
    );
    const current = await this.current(radioId, contentId);
    this.dispatchToLiquidsoap(radioId, contentId, current).catch(() => {});
    return metadata;
  }
}
