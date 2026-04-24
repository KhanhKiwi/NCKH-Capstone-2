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
exports.UserActionLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const level_entity_1 = require("../../levels/entities/level.entity");
const step_entity_1 = require("../../steps/entities/step.entity");
let UserActionLog = class UserActionLog {
    log_id;
    user;
    level;
    step;
    action;
    is_correct;
    action_time;
    created_at;
    updated_at;
    deleted_at;
};
exports.UserActionLog = UserActionLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserActionLog.prototype, "log_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserActionLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => level_entity_1.Level),
    (0, typeorm_1.JoinColumn)({ name: 'level_id' }),
    __metadata("design:type", level_entity_1.Level)
], UserActionLog.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => step_entity_1.Step),
    (0, typeorm_1.JoinColumn)({ name: 'step_id' }),
    __metadata("design:type", step_entity_1.Step)
], UserActionLog.prototype, "step", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserActionLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], UserActionLog.prototype, "is_correct", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserActionLog.prototype, "action_time", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserActionLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserActionLog.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], UserActionLog.prototype, "deleted_at", void 0);
exports.UserActionLog = UserActionLog = __decorate([
    (0, typeorm_1.Entity)('UserActionLog')
], UserActionLog);
//# sourceMappingURL=user-action-log.entity.js.map