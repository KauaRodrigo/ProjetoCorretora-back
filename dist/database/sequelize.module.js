"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeConfigModule = void 0;
const sequelize_1 = require("@nestjs/sequelize");
const common_1 = require("@nestjs/common");
const user_model_1 = require("./models/user.model");
const role_model_1 = require("./models/role.model");
const sinistro_model_1 = require("./models/sinistro.model");
const userRole_model_1 = require("./models/userRole.model");
let SequelizeConfigModule = class SequelizeConfigModule {
};
exports.SequelizeConfigModule = SequelizeConfigModule;
exports.SequelizeConfigModule = SequelizeConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([user_model_1.User, role_model_1.default, sinistro_model_1.default, userRole_model_1.default])],
        exports: [sequelize_1.SequelizeModule],
    })
], SequelizeConfigModule);
//# sourceMappingURL=sequelize.module.js.map