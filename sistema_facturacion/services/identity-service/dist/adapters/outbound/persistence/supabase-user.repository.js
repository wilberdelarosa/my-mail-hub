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
exports.SupabaseUserRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const user_entity_1 = require("../../../domain/entities/user.entity");
const email_vo_1 = require("../../../domain/value-objects/email.vo");
const role_entity_1 = require("../../../domain/entities/role.entity");
const permission_entity_1 = require("../../../domain/entities/permission.entity");
let SupabaseUserRepository = class SupabaseUserRepository {
    supabase;
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'http://localhost:54321', process.env.SUPABASE_SERVICE_KEY || 'your-service-key');
    }
    async findByEmail(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `)
            .eq('email', email)
            .single();
        if (error || !data) {
            return null;
        }
        return this.mapToEntity(data);
    }
    async findById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `)
            .eq('id', id)
            .single();
        if (error || !data) {
            return null;
        }
        return this.mapToEntity(data);
    }
    async save(user) {
        const { error } = await this.supabase
            .from('users')
            .upsert({
            id: user.id,
            email: user.email.value,
            name: user.name,
            password_hash: user.passwordHash,
            is_active: user.isActive,
            created_at: user.createdAt,
            updated_at: new Date(),
        });
        if (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }
    async delete(id) {
        const { error } = await this.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const { data, error, count } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `, { count: 'exact' })
            .range(offset, offset + limit - 1);
        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
        return {
            users: data?.map(this.mapToEntity) || [],
            total: count || 0,
        };
    }
    async emailExists(email) {
        const { data } = await this.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        return !!data;
    }
    mapToEntity(data) {
        const roles = data.user_roles?.map((ur) => {
            const permissions = ur.role.role_permissions?.map((rp) => new permission_entity_1.Permission(rp.permission.id, rp.permission.name, rp.permission.description, rp.permission.resource, rp.permission.action)) || [];
            return new role_entity_1.Role(ur.role.id, ur.role.name, ur.role.description, permissions, new Date(ur.role.created_at));
        }) || [];
        return new user_entity_1.User(data.id, new email_vo_1.Email(data.email), data.name, roles, new Date(data.created_at), data.is_active, data.password_hash);
    }
};
exports.SupabaseUserRepository = SupabaseUserRepository;
exports.SupabaseUserRepository = SupabaseUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseUserRepository);
//# sourceMappingURL=supabase-user.repository.js.map