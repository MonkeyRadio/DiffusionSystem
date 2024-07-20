import { Test, TestingModule } from '@nestjs/testing';
import { HlsDiffService } from './hls-diff.service';

describe('HlsDiffService', () => {
  let service: HlsDiffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HlsDiffService],
    }).compile();

    service = module.get<HlsDiffService>(HlsDiffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
