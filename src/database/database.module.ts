require('dotenv').config()

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            autoLoadModels: true,
            synchronize: true            
        })
    ],
})
export class DatabaseModule {}
