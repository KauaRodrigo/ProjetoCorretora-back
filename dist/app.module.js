"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_module_1 = require("./database/config.module");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const users_module_1 = require("./users/users.module");
const sequelize_module_1 = require("./database/sequelize.module");
const auth_module_1 = require("./auth/auth.module");
const sinistros_controller_1 = require("./sinistros/sinistros.controller");
const sinistros_module_1 = require("./sinistros/sinistros.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.DatabaseModule, sequelize_module_1.SequelizeConfigModule, users_module_1.UsersModule, auth_module_1.AuthModule, sinistros_module_1.SinistrosModule],
        controllers: [app_controller_1.AppController, users_controller_1.UsersController, sinistros_controller_1.SinistrosController],
        providers: [app_service_1.AppService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map