import { Module } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { SinistrosController } from './sinistros.controller';
import Sinistro from 'src/database/models/sinistro.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Sinistro])],
  controllers: [SinistrosController],
  providers: [SinistrosService],
  exports: [SinistrosService]
})
export class SinistrosModule {}
