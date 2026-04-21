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
exports.LevelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const level_entity_1 = require("./entities/level.entity");
const user_progress_entity_1 = require("../progress/entities/user-progress.entity");
const user_entity_1 = require("../users/entities/user.entity");
let LevelsService = class LevelsService {
    levelRepo;
    progressRepo;
    userRepo;
    constructor(levelRepo, progressRepo, userRepo) {
        this.levelRepo = levelRepo;
        this.progressRepo = progressRepo;
        this.userRepo = userRepo;
    }
    create(dto) {
        return this.levelRepo.save(dto);
    }
    findAll() {
        return this.levelRepo.find();
    }
    findOne(id) {
        return this.levelRepo.findOne({ where: { level_id: id } });
    }
    async update(id, dto) {
        await this.levelRepo.update(id, dto);
        return this.findOne(id);
    }
    remove(id) {
        return this.levelRepo.softDelete(id);
    }
    async unlockLevel(userId, levelId) {
        const level = await this.levelRepo.findOne({ where: { level_id: levelId } });
        if (!level) {
            throw new common_1.BadRequestException('Level not found');
        }
        const user = await this.userRepo.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
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
        }
        else {
            if (userProgress.status === 'completed') {
            }
            else {
                userProgress.status = 'unlocked';
            }
        }
        const saved = await this.progressRepo.save(userProgress);
        return saved;
    }
};
exports.LevelsService = LevelsService;
exports.LevelsService = LevelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __param(1, (0, typeorm_1.InjectRepository)(user_progress_entity_1.UserProgress)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LevelsService);
//# sourceMappingURL=levels.service.js.map