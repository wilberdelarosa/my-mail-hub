"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const login_usecase_1 = require("../../application/use-cases/login.usecase");
const register_usecase_1 = require("../../application/use-cases/register.usecase");
const auth_controller_1 = require("../../adapters/inbound/http/auth.controller");
const supabase_user_repository_1 = require("../../adapters/outbound/persistence/supabase-user.repository");
const rabbitmq_event_publisher_1 = require("../../adapters/outbound/events/rabbitmq-event.publisher");
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'alito-secret-key-2026',
                signOptions: {
                    issuer: 'identity-service',
                },
            }),
        ],
        controllers: [
            auth_controller_1.AuthController,
        ],
        providers: [
            login_usecase_1.LoginUseCase,
            register_usecase_1.RegisterUseCase,
            {
                provide: 'UserRepositoryPort',
                useClass: supabase_user_repository_1.SupabaseUserRepository,
            },
            {
                provide: 'EventPublisherPort',
                useClass: rabbitmq_event_publisher_1.RabbitMQEventPublisher,
            },
        ],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map