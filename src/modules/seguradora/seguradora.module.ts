import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import Seguradora from "src/database/models/seguradora.model";
import { SeguradoraController } from "./seguradora.controller";
import { SeguradoraService } from "./seguradora.service";
import { databaseProvider } from "src/config/database.config";

@Module({
    imports: [SequelizeModule.forFeature([Seguradora])],
    controllers: [SeguradoraController],
    providers: [SeguradoraService, ...databaseProvider],
    exports: [SeguradoraService, ...databaseProvider]
})
export class SeguradoraModule {}