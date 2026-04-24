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
exports.Level = void 0;
const typeorm_1 = require("typeorm");
const craft_entity_1 = require("../../crafts/entities/craft.entity");
const step_entity_1 = require("../../steps/entities/step.entity");
const player_session_entity_1 = require("../../sessions/entities/player-session.entity");
const user_progress_entity_1 = require("../../progress/entities/user-progress.entity");
let Level = class Level {
    level_id;
    craft;
    level_number;
    difficulty;
    steps;
    sessions;
    progresses;
    created_at;
    updated_at;
    deleted_at;
};
exports.Level = Level;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Level.prototype, "level_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => craft_entity_1.Craft, (craft) => craft.levels),
    (0, typeorm_1.JoinColumn)({ name: 'craft_id' }),
    __metadata("design:type", craft_entity_1.Craft)
], Level.prototype, "craft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Level.prototype, "level_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Level.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => step_entity_1.Step, (step) => step.level),
    __metadata("design:type", Array)
], Level.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_session_entity_1.PlayerSession, (session) => session.level),
    __metadata("design:type", Array)
], Level.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_progress_entity_1.UserProgress, (progress) => progress.level),
    __metadata("design:type", Array)
], Level.prototype, "progresses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Level.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Level.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Level.prototype, "deleted_at", void 0);
exports.Level = Level = __decorate([
    (0, typeorm_1.Entity)('Level')
], Level);
//# sourceMappingURL=level.entity.js.map