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
exports.Craft = void 0;
const typeorm_1 = require("typeorm");
const level_entity_1 = require("../../levels/entities/level.entity");
const craft_village_entity_1 = require("../../villages/entities/craft-village.entity");
let Craft = class Craft {
    craft_id;
    name;
    description;
    village;
    levels;
    created_at;
    updated_at;
    deleted_at;
};
exports.Craft = Craft;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Craft.prototype, "craft_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Craft.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Craft.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => craft_village_entity_1.CraftVillage, (village) => village.crafts),
    (0, typeorm_1.JoinColumn)({ name: 'village_id' }),
    __metadata("design:type", craft_village_entity_1.CraftVillage)
], Craft.prototype, "village", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => level_entity_1.Level, (level) => level.craft),
    __metadata("design:type", Array)
], Craft.prototype, "levels", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Craft.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Craft.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Craft.prototype, "deleted_at", void 0);
exports.Craft = Craft = __decorate([
    (0, typeorm_1.Entity)('Craft')
], Craft);
//# sourceMappingURL=craft.entity.js.map