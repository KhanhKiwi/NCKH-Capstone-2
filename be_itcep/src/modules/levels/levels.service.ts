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

	async findAll(userId?: number) {
		// include craft relation (and craft.village) so callers can determine which village a level belongs to
		const levels = await this.levelRepo.find({ relations: ['craft', 'craft.village'] });
		if (!userId) return levels;

		// attach user's progress (if any) to each level for convenience
		const progress = await this.progressRepo.find({ where: { user: { user_id: userId } }, relations: ['level'] });
		const byLevel = new Map<number, UserProgress>();
		for (const p of progress) {
			if (p && p.level && typeof p.level.level_id === 'number') byLevel.set(p.level.level_id, p);
		}
		return levels.map(l => ({
			...l,
			user_progress: byLevel.get(l.level_id) ?? null,
			// unlocked is determined solely by user progress (unlocked/completed). Do NOT use deleted_at.
			unlocked: (byLevel.get(l.level_id)?.status === 'unlocked') || (byLevel.get(l.level_id)?.status === 'completed'),
		}));
	}

	async findOne(id: number, userId?: number) {
		const level = await this.levelRepo.findOne({ where: { level_id: id }, relations: ['craft', 'craft.village'] });
		if (!userId || !level) return level;
		const p = await this.progressRepo.findOne({ where: { user: { user_id: userId }, level: { level_id: id } }, relations: ['level'] });
		return {
			...level,
			user_progress: p ?? null,
			// unlocked determined only by user's progress
			unlocked: (p?.status === 'unlocked') || (p?.status === 'completed'),
		}
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
