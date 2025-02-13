import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ClienteController } from './clientes.controller';
import Cliente from "src/database/models/clientes.model";
import { ClientesService } from "./clientes.service";
import { databaseProvider } from "src/config/database.config";
import Seguradora from "src/database/models/seguradora.model";

@Module({
    imports: [SequelizeModule.forFeature([Cliente, Seguradora])],
    controllers: [ClienteController],
    providers: [ClientesService, ...databaseProvider],
    exports: [ClientesService, ...databaseProvider]
})
export class ClienteModule {}