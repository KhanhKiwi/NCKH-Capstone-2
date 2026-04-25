"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../modules/users/entities/user.entity");
const user_progress_entity_1 = require("../modules/progress/entities/user-progress.entity");
const level_entity_1 = require("../modules/levels/entities/level.entity");
const craft_entity_1 = require("../modules/crafts/entities/craft.entity");
const craft_village_entity_1 = require("../modules/villages/entities/craft-village.entity");
const media_entity_1 = require("../modules/media/entities/media.entity");
const player_session_entity_1 = require("../modules/sessions/entities/player-session.entity");
const analytics_event_entity_1 = require("../modules/analytics/entities/analytics-event.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 3307),
                    username: configService.get('DB_USER', 'root'),
                    password: configService.get('DB_PASS', ''),
                    database: configService.get('DB_NAME', 'itcep_db'),
                    entities: [
                        user_entity_1.User,
                        user_progress_entity_1.UserProgress,
                        level_entity_1.Level,
                        craft_entity_1.Craft,
                        craft_village_entity_1.CraftVillage,
                        media_entity_1.Media,
                        player_session_entity_1.PlayerSession,
                        analytics_event_entity_1.AnalyticsEvent,
                    ],
                    synchronize: false,
                    logging: ['error', 'warn'],
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map