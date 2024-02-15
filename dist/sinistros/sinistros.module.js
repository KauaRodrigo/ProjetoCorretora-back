"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SinistrosModule = void 0;
const common_1 = require("@nestjs/common");
const sinistros_service_1 = require("./sinistros.service");
const sinistros_controller_1 = require("./sinistros.controller");
const sinistro_model_1 = require("../database/models/sinistro.model");
const sequelize_1 = require("@nestjs/sequelize");
let SinistrosModule = class SinistrosModule {
};
exports.SinistrosModule = SinistrosModule;
exports.SinistrosModule = SinistrosModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([sinistro_model_1.default])],
        controllers: [sinistros_controller_1.SinistrosController],
        providers: [sinistros_service_1.SinistrosService],
        exports: [sinistros_service_1.SinistrosService]
    })
], SinistrosModule);
//# sourceMappingURL=sinistros.module.js.map