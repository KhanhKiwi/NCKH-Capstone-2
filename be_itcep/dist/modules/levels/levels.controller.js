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
exports.LevelsController = void 0;
const common_1 = require("@nestjs/common");
const levels_service_1 = require("./levels.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../../auth/get-user.decorator");
const unlock_level_response_1 = require("./dto/unlock-level.response");
let LevelsController = class LevelsController {
    levelsService;
    constructor(levelsService) {
        this.levelsService = levelsService;
    }
    create(dto) {
        return this.levelsService.create(dto);
    }
    findAll() {
        return this.levelsService.findAll();
    }
    findOne(id) {
        return this.levelsService.findOne(id);
    }
    update(id, dto) {
        return this.levelsService.update(id, dto);
    }
    remove(id) {
        return this.levelsService.remove(id);
    }
    async unlockLevel(levelId, userId) {
        return this.levelsService.unlockLevel(userId, levelId);
    }
};
exports.LevelsController = LevelsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create level' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LevelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LevelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LevelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LevelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LevelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':levelId/unlock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Unlock a level for the current user',
        description: 'Unlocks a specific level for the authenticated user. Creates or updates user progress record.',
    }),
    (0, swagger_1.ApiParam)({ name: 'levelId', description: 'ID of the level to unlock', required: true, example: 1 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Level unlocked successfully',
        type: unlock_level_response_1.UnlockLevelResponseDto,
        example: {
            progress_id: 1,
            user_id: 1,
            level_id: 1,
            status: 'unlocked',
            score: 0,
            completed_at: null,
            created_at: '2026-04-21T10:30:00Z',
            updated_at: '2026-04-21T10:30:00Z',
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Missing or invalid authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Level not found or invalid input',
    }),
    __param(0, (0, common_1.Param)('levelId', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "unlockLevel", null);
exports.LevelsController = LevelsController = __decorate([
    (0, swagger_1.ApiTags)('levels'),
    (0, common_1.Controller)('levels'),
    __metadata("design:paramtypes", [levels_service_1.LevelsService])
], LevelsController);
//# sourceMappingURL=levels.controller.js.map