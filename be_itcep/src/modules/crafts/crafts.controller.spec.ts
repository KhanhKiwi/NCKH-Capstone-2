import { Test, TestingModule } from '@nestjs/testing';
import { CraftsController } from './crafts.controller';

describe('CraftsController', () => {
  let controller: CraftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CraftsController],
    }).compile();

    controller = module.get<CraftsController>(CraftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
