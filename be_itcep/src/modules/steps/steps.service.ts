import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Step } from './entities/step.entity';

@Injectable()
export class StepsService {
	constructor(@InjectRepository(Step) private repo: Repository<Step>) {}

	create(dto: Partial<Step>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { step_id: id } });
	}

	async update(id: number, dto: Partial<Step>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
