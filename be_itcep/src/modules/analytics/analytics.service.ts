import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
	constructor(@InjectRepository(AnalyticsEvent) private repo: Repository<AnalyticsEvent>) {}

	create(dto: Partial<AnalyticsEvent>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { event_id: id } });
	}

	async update(id: number, dto: Partial<AnalyticsEvent>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
