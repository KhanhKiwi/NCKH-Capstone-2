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
exports.CraftVillage = void 0;
const typeorm_1 = require("typeorm");
const media_entity_1 = require("../../media/entities/media.entity");
const craft_entity_1 = require("../../crafts/entities/craft.entity");
let CraftVillage = class CraftVillage {
    village_id;
    name;
    description;
    image;
    city;
    media;
    crafts;
    created_at;
    updated_at;
    deleted_at;
    is_open;
};
exports.CraftVillage = CraftVillage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CraftVillage.prototype, "village_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], CraftVillage.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CraftVillage.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512, nullable: true }),
    __metadata("design:type", String)
], CraftVillage.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], CraftVillage.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.Media, (media) => media.village),
    __metadata("design:type", Array)
], CraftVillage.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => craft_entity_1.Craft, (craft) => craft.village),
    __metadata("design:type", Array)
], CraftVillage.prototype, "crafts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CraftVillage.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CraftVillage.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], CraftVillage.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CraftVillage.prototype, "is_open", void 0);
exports.CraftVillage = CraftVillage = __decorate([
    (0, typeorm_1.Entity)('Craft_Villages')
], CraftVillage);
//# sourceMappingURL=craft-village.entity.js.map