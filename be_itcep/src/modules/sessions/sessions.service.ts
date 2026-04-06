import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerSession } from './entities/player-session.entity';

@Injectable()
export class SessionsService {
	constructor(@InjectRepository(PlayerSession) private repo: Repository<PlayerSession>) {}

	create(dto: Partial<PlayerSession>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { session_id: id } });
	}

	async update(id: number, dto: Partial<PlayerSession>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.repo.softDelete(id);
	}
}
