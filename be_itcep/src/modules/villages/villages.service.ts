import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CraftVillage } from './entities/craft-village.entity';

@Injectable()
export class VillagesService {
	constructor(@InjectRepository(CraftVillage) private repo: Repository<CraftVillage>) {}

	create(dto: Partial<CraftVillage>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { village_id: id } });
	}

	async update(id: number, dto: Partial<CraftVillage>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	async setOpenStatus(id: number, open: boolean) {
		const entity = await this.repo.findOne({ where: { village_id: id } });
		if (!entity) throw new NotFoundException(`Village ${id} not found`);
		entity.is_open = open;
		return this.repo.save(entity);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
