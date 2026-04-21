"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const console_1 = require("console");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const villages_module_1 = require("./modules/villages/villages.module");
const crafts_module_1 = require("./modules/crafts/crafts.module");
const progress_module_1 = require("./modules/progress/progress.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const media_module_1 = require("./modules/media/media.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ITCEP API')
        .setDescription('API documentation for ITCEP backend')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        include: [auth_module_1.AuthModule, users_module_1.UsersModule, villages_module_1.VillagesModule, crafts_module_1.CraftsModule, progress_module_1.ProgressModule, sessions_module_1.SessionsModule, media_module_1.MediaModule],
    });
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
    (0, console_1.log)('Swagger UI available at http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map