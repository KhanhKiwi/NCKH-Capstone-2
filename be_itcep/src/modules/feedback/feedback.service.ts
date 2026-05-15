import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FeedbackService {
  constructor(@InjectRepository(Feedback) private repo: Repository<Feedback>, @InjectRepository(User) private userRepo: Repository<User>) {}

  async create(dto: CreateFeedbackDto) {
    const fb: Partial<Feedback> = {
      feedback_text: dto.content ?? (dto as any).feedbackText,
      name: dto.name,
      rating: dto.rating,
    };
    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { user_id: dto.userId } as any });
      if (user) fb.user = user as any;
    }
    return this.repo.save(fb as any);
  }

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { feedback_id: id } });
  }

  async update(id: number, dto: Partial<Feedback>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
