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
let LevelsService = class LevelsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.save(dto);
    }
    findAll() {
        return this.repo.find({ relations: ['craft', 'craft.village'], withDeleted: true });
    }
    findOne(id) {
        return this.repo.findOne({ where: { level_id: id }, relations: ['craft', 'craft.village'], withDeleted: true });
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    remove(id) {
        return this.repo.softDelete(id);
    }
};
exports.LevelsService = LevelsService;
exports.LevelsService = LevelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LevelsService);
//# sourceMappingURL=levels.service.js.map