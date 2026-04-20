import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillagesController } from './villages.controller';
import { VillagesService } from './villages.service';
import { CraftVillage } from './entities/craft-village.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CraftVillage])],
  controllers: [VillagesController],
  providers: [VillagesService],
  exports: [VillagesService],
})
export class VillagesModule {}
