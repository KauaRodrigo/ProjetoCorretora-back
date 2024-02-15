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
const sequelize_typescript_1 = require("sequelize-typescript");
const statusSinistro_1 = require("../../enums/statusSinistro");
const tipoSinistros_1 = require("../../enums/tipoSinistros");
let Sinistro = class Sinistro extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Sinistro.prototype, "codigo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sinistro.prototype, "placa", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sinistro.prototype, "nome", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sinistro.prototype, "seguradora", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sinistro.prototype, "evento", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Sinistro.prototype, "terceiro", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sinistro.prototype, "caminho", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(tipoSinistros_1.TipoSinistro))),
    __metadata("design:type", String)
], Sinistro.prototype, "tipo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(statusSinistro_1.StatusSinistro))),
    __metadata("design:type", String)
], Sinistro.prototype, "status", void 0);
Sinistro = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'frcorretora',
        tableName: 'sinistros'
    })
], Sinistro);
exports.default = Sinistro;
//# sourceMappingURL=sinistro.model.js.map