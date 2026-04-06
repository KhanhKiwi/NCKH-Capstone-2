import { Injectable } from '@nestjs/common';
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

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
