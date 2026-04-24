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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.save(dto);
    }
    findAll() {
        return this.repo.find();
    }
    findOne(id) {
        return this.repo.findOne({ where: { user_id: id } });
    }
    findByEmailOrUsername(identifier) {
        return this.repo.findOne({
            where: [
                { email: identifier },
                { username: identifier },
                { name: identifier }
            ]
        });
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.findOne(id);
        if (!user || !user.password)
            throw new Error('User not found');
        const bcrypt = await import('bcryptjs');
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match)
            throw new Error('Current password is incorrect');
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await this.repo.update(id, { password: hashed });
        return this.findOne(id);
    }
    remove(id) {
        console.log('[UsersService] delete', id);
        return this.repo.delete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map