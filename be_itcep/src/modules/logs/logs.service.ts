import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActionLog } from './entities/user-action-log.entity';

@Injectable()
export class LogsService {
	constructor(@InjectRepository(UserActionLog) private repo: Repository<UserActionLog>) {}

	create(dto: Partial<UserActionLog>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { log_id: id } });
	}

	async update(id: number, dto: Partial<UserActionLog>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
