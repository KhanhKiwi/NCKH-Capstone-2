import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

export interface Feedback {
  id: number;
  userId: number;
  feedbackText: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class FeedbackService {
  private store: Feedback[] = [
    {
      id: 1,
      userId: 1,
      feedbackText: 'Great experience, loved it!',
      rating: 5,
      created_at: '2026-04-25T10:00:00.000Z',
      updated_at: '2026-04-25T10:00:00.000Z',
    },
    {
      id: 2,
      userId: 2,
      feedbackText: 'Good service, but can improve.',
      rating: 4,
      created_at: '2026-04-25T10:05:00.000Z',
      updated_at: '2026-04-25T10:05:00.000Z',
    },
  ];

  findAll(): Feedback[] {
    return this.store;
  }

  findOne(id: number): Feedback {
    const f = this.store.find((s) => s.id === id);
    if (!f) throw new NotFoundException('Feedback not found');
    return f;
  }

  create(createFeedbackDto: CreateFeedbackDto) {
    const id = this.store.length ? this.store[this.store.length - 1].id + 1 : 1;
    const now = new Date().toISOString();
    const record: Feedback = {
      id,
      userId: createFeedbackDto.userId,
      feedbackText: createFeedbackDto.feedbackText,
      rating: createFeedbackDto.rating,
      created_at: now,
      updated_at: now,
    };
    this.store.push(record);
    return { message: 'Feedback created successfully', data: record };
  }

  remove(id: number) {
    const idx = this.store.findIndex((s) => s.id === id);
    if (idx === -1) throw new NotFoundException('Feedback not found');
    const [removed] = this.store.splice(idx, 1);
    return { message: 'Deleted', data: removed };
  }
}