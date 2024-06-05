import { Test, TestingModule } from '@nestjs/testing';
import { HlsDiffController } from './hls-diff.controller';
import { HlsDiffService } from './hls-diff.service';

describe('HlsDiffController', () => {
  let controller: HlsDiffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HlsDiffController],
      providers: [HlsDiffService],
    }).compile();

    controller = module.get<HlsDiffController>(HlsDiffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
