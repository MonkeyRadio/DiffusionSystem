import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LiquidsoapApiService } from '../liquidsoap-api.service';
import { MetadataRequest } from '../requests/metadata.request';
import { QueryFilter } from '@/shared/query-filter/query-filter';

@Injectable()
export class MetadataRepository {
  private readonly resource = '/metadata';

  constructor(
    @Inject(forwardRef(() => LiquidsoapApiService))
    private readonly liquidsoapApiService: LiquidsoapApiService,
  ) {}

  public async dispatch(
    radioId: string,
    contentId: string,
    metadata: MetadataRequest,
  ): Promise<void> {
    const filters = new QueryFilter()
      .set('title', metadata.title)
      .set('artist', metadata.artist)
      .set('album', metadata.album)
      .set('year', metadata.year)
      .set('tracknumber', metadata.trackNumber)
      .set('date', metadata.tsPosted)
      .set('comment', JSON.stringify(metadata.comment));

    return this.liquidsoapApiService
      .use(radioId, contentId)
      .post(`${this.resource}?${filters.urlEncoded}`, {});
  }
}
