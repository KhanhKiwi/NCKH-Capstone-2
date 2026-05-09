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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSession = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const craft_entity_1 = require("../../crafts/entities/craft.entity");
let PlayerSession = class PlayerSession {
    session_id;
    user;
    craft;
    start_time;
    end_time;
    total_time;
    created_at;
    updated_at;
    deleted_at;
};
exports.PlayerSession = PlayerSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlayerSession.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sessions),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], PlayerSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => craft_entity_1.Craft, (craft) => craft.sessions),
    (0, typeorm_1.JoinColumn)({ name: 'craft_id' }),
    __metadata("design:type", craft_entity_1.Craft)
], PlayerSession.prototype, "craft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PlayerSession.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PlayerSession.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PlayerSession.prototype, "total_time", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlayerSession.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PlayerSession.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], PlayerSession.prototype, "deleted_at", void 0);
exports.PlayerSession = PlayerSession = __decorate([
    (0, typeorm_1.Entity)('Player_Sessions')
], PlayerSession);
//# sourceMappingURL=player-session.entity.js.map