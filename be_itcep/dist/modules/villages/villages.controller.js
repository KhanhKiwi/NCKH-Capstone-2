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
exports.VillagesController = void 0;
const common_1 = require("@nestjs/common");
const villages_service_1 = require("./villages.service");
const swagger_1 = require("@nestjs/swagger");
let VillagesController = class VillagesController {
    villagesService;
    constructor(villagesService) {
        this.villagesService = villagesService;
    }
    create(dto) {
        return this.villagesService.create(dto);
    }
    findAll() {
        return this.villagesService.findAll();
    }
    findOne(id) {
        return this.villagesService.findOne(id);
    }
    update(id, dto) {
        return this.villagesService.update(id, dto);
    }
    setOpen(id, open) {
        return this.villagesService.setOpenStatus(id, open);
    }
    remove(id) {
        return this.villagesService.remove(id);
    }
};
exports.VillagesController = VillagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create village' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/open'),
    (0, swagger_1.ApiOperation)({ summary: 'Set village open/closed status' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('open')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "setOpen", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VillagesController.prototype, "remove", null);
exports.VillagesController = VillagesController = __decorate([
    (0, swagger_1.ApiTags)('villages'),
    (0, common_1.Controller)('villages'),
    __metadata("design:paramtypes", [villages_service_1.VillagesService])
], VillagesController);
//# sourceMappingURL=villages.controller.js.map