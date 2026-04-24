import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { UserProgress } from '../progress/entities/user-progress.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LevelsService {
	constructor(
		@InjectRepository(Level) private levelRepo: Repository<Level>,
		@InjectRepository(UserProgress) private progressRepo: Repository<UserProgress>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) {}

	create(dto: Partial<Level>) {
		return this.levelRepo.save(dto);
	}

	findAll() {
		return this.levelRepo.find();
	}

	findOne(id: number) {
		return this.levelRepo.findOne({ where: { level_id: id } });
	}

	async update(id: number, dto: Partial<Level>) {
		await this.levelRepo.update(id, dto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.levelRepo.softDelete(id);
	}

	async unlockLevel(userId: number, levelId: number) {
		// Validate level
		const level = await this.levelRepo.findOne({ where: { level_id: levelId } });
		if (!level) {
			throw new BadRequestException('Level not found');
		}

		// Validate user exists
		const user = await this.userRepo.findOne({ where: { user_id: userId } });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		// Find existing progress for this user & level (include relations so TypeORM can match nested where)
		let userProgress = await this.progressRepo.findOne({
			where: { user: { user_id: userId }, level: { level_id: levelId } },
			relations: ['user', 'level'],
		});

		if (!userProgress) {
			userProgress = this.progressRepo.create({
				user,
				level,
				status: 'unlocked',
				score: 0,
			});
		} else {
			// If already completed, keep completed status
			if (userProgress.status === 'completed') {
				// do nothing
			} else {
				userProgress.status = 'unlocked';
			}
		}

		const saved = await this.progressRepo.save(userProgress);
		return saved;
	}
}
