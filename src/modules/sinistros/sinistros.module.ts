import { Module } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { SinistrosController } from './sinistros.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import Comments from "../../database/models/comments.model";
import Sinistro from "../../database/models/sinistro.model";
import Seguradora from "../../database/models/seguradora.model";
import Cliente from "../../database/models/clientes.model";
import {databaseProvider} from "../../config/database.config";
import { User } from 'src/database/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Comments, Sinistro, Seguradora, Cliente, User])],
  controllers: [SinistrosController],
  providers: [SinistrosService, ...databaseProvider],
  exports: [SinistrosService, ...databaseProvider]
})
export class SinistrosModule {}
