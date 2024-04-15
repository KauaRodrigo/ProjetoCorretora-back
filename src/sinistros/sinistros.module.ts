import { Module } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { SinistrosController } from './sinistros.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import Adress from "../database/models/adress.model";
import Comments from "../database/models/comments.model";
import Sinistro from "../database/models/sinistro.model";
import Seguradora from "../database/models/seguradora.model";
import Cliente from "../database/models/clientes.model";

@Module({
  imports: [SequelizeModule.forFeature([Adress, Comments, Sinistro, Seguradora, Cliente])],
  controllers: [SinistrosController],
  providers: [SinistrosService],
  exports: [SinistrosService]
})
export class SinistrosModule {}
