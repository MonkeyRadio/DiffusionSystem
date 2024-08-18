import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MetadataRepository } from './repositories/metadata.repository';
import { LiquidsoapFetcher } from './liquidsoap-fetcher';

@Injectable()
export class LiquidsoapApiService {
  constructor(
    @Inject(forwardRef(() => MetadataRepository))
    public readonly metadata: MetadataRepository,
  ) {}

  public use(radioId: string, contentId: string): LiquidsoapFetcher {
    return new LiquidsoapFetcher(
      `http://liquidsoap-${radioId}-${contentId}:8084`,
    );
  }
}
