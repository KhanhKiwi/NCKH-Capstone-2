import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateUserChallengeDto } from './dto/create-user-challenge.dto';
import { UserChallenge } from './entities/user-challenge.entity';
import { User } from '../users/entities/user.entity';
import { Craft } from '../crafts/entities/craft.entity';

@Injectable()
export class UserChallengesService {
  private readonly logger = new Logger(UserChallengesService.name);

  constructor(
    @InjectRepository(UserChallenge)
    private readonly repo: Repository<UserChallenge>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Craft)
    private readonly craftRepo: Repository<Craft>,
  ) {}

  async saveChallenge(dto: CreateUserChallengeDto) {
    this.logger.log(`saveChallenge called with payload ${JSON.stringify(dto)}`);
    const { user_id, craft_id, time } = dto;

    const user = await this.userRepo.findOne({ where: { user_id } });
    if (!user) throw new NotFoundException('User not found');

    const craft = await this.craftRepo.findOne({ where: { craft_id } });
    if (!craft) throw new NotFoundException('Craft not found');

    let record = await this.repo.findOne({ where: { user: { user_id }, craft: { craft_id } }, relations: ['user', 'craft'] });

    if (!record) {
      record = this.repo.create(({ user, craft, time: typeof time !== 'undefined' ? time : null } as DeepPartial<UserChallenge>));
      await this.repo.save(record);
      this.logger.log(`Saved new UserChallenge for user ${user_id} craft ${craft_id} time=${record.time}`);
      return record;
    }

    // If record exists, only update when a time is provided and it's better (smaller)
    if (typeof time !== 'undefined') {
      // if existing time is null/undefined, accept new time
      if (record.time === null || typeof record.time === 'undefined') {
        record.time = time
        await this.repo.save(record)
        this.logger.log(`Saved UserChallenge (was empty) for user ${user_id} craft ${craft_id} time=${record.time}`)
        return record
      }

      // both times present: only save if new time is strictly less (faster)
      const existing = Number(record.time)
      const incoming = Number(time)
      if (!Number.isFinite(existing) || !Number.isFinite(incoming) || incoming < existing) {
        record.time = incoming
        await this.repo.save(record)
        this.logger.log(`Updated UserChallenge for user ${user_id} craft ${craft_id} time=${record.time}`)
        return record
      }

      // incoming time is slower or equal — do not update
      this.logger.log(`Not saving slower/equal time for user ${user_id} craft ${craft_id}: incoming=${incoming} existing=${existing}`)
      return record
    }

    // no time provided — nothing to change
    return record
  }

  async getForUser(user_id: number) {
    return this.repo.find({ where: { user: { user_id } }, relations: ['craft'] });
  }

  async getLeaderboardForCraft(craft_id: number, limit = 50) {
    // return top fastest times (lowest `time`) for given craft
    const qb = this.repo.createQueryBuilder('uc')
      .leftJoinAndSelect('uc.user', 'user')
      .leftJoinAndSelect('uc.craft', 'craft')
      .where('uc.craft = :craftId', { craftId: craft_id })
      .andWhere('uc.time IS NOT NULL')
      .orderBy('uc.time', 'ASC')
      .limit(limit)

    const rows = await qb.getMany()
    return rows
  }
}
