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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../domain/entities/user.entity");
const email_vo_1 = require("../../domain/value-objects/email.vo");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
let RegisterUseCase = class RegisterUseCase {
    userRepository;
    eventPublisher;
    constructor(userRepository, eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }
    async execute(data) {
        const emailExists = await this.userRepository.emailExists(data.email);
        if (emailExists) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const email = new email_vo_1.Email(data.email);
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = new user_entity_1.User((0, uuid_1.v4)(), email, data.name, [], new Date(), true, passwordHash);
        await this.userRepository.save(user);
        await this.eventPublisher.publishUserCreated({
            userId: user.id,
            email: user.email.value,
            roles: user.roles.map((r) => r.name),
        });
        return user;
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __param(1, (0, common_1.Inject)('EventPublisherPort')),
    __metadata("design:paramtypes", [Object, Object])
], RegisterUseCase);
//# sourceMappingURL=register.usecase.js.map