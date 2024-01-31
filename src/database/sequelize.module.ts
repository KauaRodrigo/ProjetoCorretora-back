import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([])],
  exports: [SequelizeModule],
})
export class SequelizeConfigModule {}