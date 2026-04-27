import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Craft } from './entities/craft.entity';

@Injectable()
export class CraftsService {
	constructor(@InjectRepository(Craft) private repo: Repository<Craft>) {}

	create(dto: Partial<Craft>) {
		return this.repo.save(dto);
	}

	findAll() {
		// include village relation so callers can map craft -> village
		return this.repo.find({ relations: ['village'] });
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { craft_id: id }, relations: ['village'] });
	}

	async update(id: number, dto: Partial<Craft>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
