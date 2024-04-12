import { Module } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { SinistrosController } from './sinistros.controller';
import Sinistro from 'src/database/models/sinistro.model';
import Clientes from 'src/database/models/clientes.model';
import { SequelizeModule } from '@nestjs/sequelize';
import Adress from "../database/models/adress.model";

@Module({
  imports: [SequelizeModule.forFeature([Sinistro, Clientes, Adress])],
  controllers: [SinistrosController],
  providers: [SinistrosService],
  exports: [SinistrosService]
})
export class SinistrosModule {}
