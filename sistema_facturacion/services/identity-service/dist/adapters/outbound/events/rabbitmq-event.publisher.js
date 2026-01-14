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
exports.RabbitMQEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let RabbitMQEventPublisher = class RabbitMQEventPublisher {
    client;
    constructor() {
        this.client = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672'],
                queue: 'identity_events',
                queueOptions: {
                    durable: true,
                },
            },
        });
    }
    async publish(eventName, payload) {
        await this.client.emit(eventName, payload).toPromise();
    }
    async publishUserCreated(payload) {
        await this.publish('identity.user.created', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }
    async publishRoleAssigned(payload) {
        await this.publish('identity.role.assigned', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }
    async publishUserDeactivated(payload) {
        await this.publish('identity.user.deactivated', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.RabbitMQEventPublisher = RabbitMQEventPublisher;
exports.RabbitMQEventPublisher = RabbitMQEventPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RabbitMQEventPublisher);
//# sourceMappingURL=rabbitmq-event.publisher.js.map