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

	findByEmailOrUsername(identifier: string) {
		return this.repo.findOne({
			where: [
				{ email: identifier },
				{ username: identifier },
				{ name: identifier }
			]
		});
	}

	async update(id: number, dto: Partial<User>) {
		await this.repo.update(id, dto);
		return this.findOne(id);
	}

	async changePassword(id: number, currentPassword: string, newPassword: string) {
		const user = await this.findOne(id);
		if (!user || !user.password) throw new Error('User not found');
		const bcrypt = await import('bcryptjs');
		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) throw new Error('Current password is incorrect');
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(newPassword, salt);
		await this.repo.update(id, { password: hashed } as any);
		return this.findOne(id);
	}

	remove(id: number) {
		console.log('[UsersService] delete', id);
		return this.repo.delete(id);
	}
}
