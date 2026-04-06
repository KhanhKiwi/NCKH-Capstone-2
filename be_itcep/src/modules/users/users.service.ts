import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	create(dto: Partial<User>) {
		return this.repo.save(dto);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { user_id: id } });
	}

	async update(id: number, dto: Partial<User>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		console.log('[UsersService] delete', id);
		return this.repo.delete(id);
	}
}
