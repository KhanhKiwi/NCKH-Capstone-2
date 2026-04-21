"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_progress_entity_1 = require("./entities/user-progress.entity");
const level_entity_1 = require("../levels/entities/level.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ProgressService = class ProgressService {
    progressRepo;
    levelRepo;
    userRepo;
    constructor(progressRepo, levelRepo, userRepo) {
        this.progressRepo = progressRepo;
        this.levelRepo = levelRepo;
        this.userRepo = userRepo;
    }
    async saveProgress(dto) {
        const { user_id, level_id, status, score } = dto;
        const user = await this.userRepo.findOne({ where: { user_id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const level = await this.levelRepo.findOne({ where: { level_id }, relations: ['craft'] });
        if (!level)
            throw new common_1.NotFoundException('Level not found');
        let progress = await this.progressRepo.findOne({
            where: { user: { user_id }, level: { level_id } },
            relations: ['level'],
        });
        const now = new Date();
        if (!progress) {
            progress = this.progressRepo.create({
                user,
                level,
                status: status ?? 'in_progress',
                score: score ?? null,
                completed_at: status === 'completed' ? now : null,
            });
        }
        else {
            if (status)
                progress.status = status;
            if (typeof score !== 'undefined')
                progress.score = score;
            if (status === 'completed')
                progress.completed_at = now;
        }
        await this.progressRepo.save(progress);
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
                        const unlocked = this.progressRepo.create({ user, level: nextLevel, status: 'unlocked' });
                        await this.progressRepo.save(unlocked);
                    }
                    else if (existing.status === 'locked') {
                        existing.status = 'unlocked';
                        await this.progressRepo.save(existing);
                    }
                }
            }
        }
        return progress;
    }
    async getProgressForUser(user_id) {
        return this.progressRepo.find({ where: { user: { user_id } }, relations: ['level'] });
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_progress_entity_1.UserProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProgressService);
//# sourceMappingURL=progress.service.js.map