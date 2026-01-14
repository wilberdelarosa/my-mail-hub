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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_usecase_1 = require("../../../application/use-cases/login.usecase");
const register_usecase_1 = require("../../../application/use-cases/register.usecase");
const auth_dto_1 = require("./dtos/auth.dto");
let AuthController = class AuthController {
    loginUseCase;
    registerUseCase;
    constructor(loginUseCase, registerUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
    }
    async login(loginDto) {
        const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user.toJSON(),
        };
    }
    async register(registerDto) {
        const user = await this.registerUseCase.execute(registerDto);
        return {
            message: 'Usuario creado exitosamente',
            user: user.toJSON(),
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login de usuario',
        description: 'Autentica un usuario y retorna tokens JWT'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login exitoso',
        type: auth_dto_1.LoginResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Credenciales inválidas'
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Usuario desactivado'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Registrar nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario creado exitosamente'
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'El email ya está registrado'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [login_usecase_1.LoginUseCase,
        register_usecase_1.RegisterUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map