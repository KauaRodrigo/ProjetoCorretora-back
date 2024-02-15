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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const role_model_1 = require("../database/models/role.model");
const user_model_1 = require("../database/models/user.model");
const userRole_model_1 = require("../database/models/userRole.model");
let UsersService = class UsersService {
    constructor(userModel, roleModel, userRoleModel) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.userRoleModel = userRoleModel;
    }
    async create(payload) {
        const user = await this.userModel.create(payload);
        const roles = await this.roleModel.findAll({
            where: {
                name: {
                    [sequelize_2.Op.in]: payload.roles
                }
            }
        });
        await user.$set('roles', roles);
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({
            where: {
                email: email,
            },
            include: [this.roleModel]
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.default)),
    __param(2, (0, sequelize_1.InjectModel)(userRole_model_1.default)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map