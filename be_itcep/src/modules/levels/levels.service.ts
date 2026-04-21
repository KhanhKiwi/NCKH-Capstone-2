import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsService {
	constructor(@InjectRepository(Level) private repo: Repository<Level>) {}

	create(dto: Partial<Level>) {
		return this.repo.save(dto);
	}

	findAll() {
		// include craft and craft.village relations so frontend can filter by village
		// include soft-deleted rows too (deleted_at used as lock flag)
		return this.repo.find({ relations: ['craft', 'craft.village'], withDeleted: true });
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { level_id: id }, relations: ['craft', 'craft.village'], withDeleted: true });
	}

	async update(id: number, dto: Partial<Level>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
