import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UserProgress } from './entities/user-progress.entity';
import { Level } from '../levels/entities/level.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProgressService {
	constructor(
		@InjectRepository(UserProgress)
		private readonly progressRepo: Repository<UserProgress>,

		@InjectRepository(Level)
		private readonly levelRepo: Repository<Level>,

		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {}

	async saveProgress(dto: CreateProgressDto) {
		const { user_id, level_id, status, score } = dto;

		const user = await this.userRepo.findOne({ where: { user_id } });
		if (!user) throw new NotFoundException('User not found');

		const level = await this.levelRepo.findOne({ where: { level_id }, relations: ['craft'] });
		if (!level) throw new NotFoundException('Level not found');

		let progress = await this.progressRepo.findOne({
			where: { user: { user_id }, level: { level_id } },
			relations: ['level'],
		});

		const now = new Date();

		if (!progress) {
			progress = this.progressRepo.create(
				({
					user,
					level,
					status: status ?? 'in_progress',
					score: score ?? null,
					completed_at: status === 'completed' ? now : null,
				} as DeepPartial<UserProgress>),
			);
		} else {
			if (status) progress.status = status;
			if (typeof score !== 'undefined') progress.score = score;
			if (status === 'completed') progress.completed_at = now;
		}

		await this.progressRepo.save(progress);

		// If completed, unlock next level (same craft, level_number + 1)
		if (status === 'completed') {
			const currentLevel = level;
			if (typeof currentLevel.level_number === 'number') {
				const nextLevel = await this.levelRepo.findOne({
					where: { craft: { craft_id: currentLevel.craft.craft_id }, level_number: currentLevel.level_number + 1 },
				});

				if (nextLevel) {
					const existing = await this.progressRepo.findOne({
						where: { user: { user_id }, level: { level_id: nextLevel.level_id } },
					});

					if (!existing) {
						const unlocked = this.progressRepo.create(
							({ user, level: nextLevel, status: 'unlocked' } as DeepPartial<UserProgress>),
						);
						await this.progressRepo.save(unlocked);
					} else if (existing.status === 'locked') {
						existing.status = 'unlocked';
						await this.progressRepo.save(existing);
					}
				}
			}
		}

		return progress;
	}

	async getProgressForUser(user_id: number) {
		return this.progressRepo.find({ where: { user: { user_id } }, relations: ['level'] });
	}
}
