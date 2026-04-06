import { Test, TestingModule } from '@nestjs/testing';
import { CraftsService } from './crafts.service';

describe('CraftsService', () => {
  let service: CraftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraftsService],
    }).compile();

    service = module.get<CraftsService>(CraftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
