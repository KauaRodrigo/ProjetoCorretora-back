import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            host: 'frcorretora.c9ayy8oy4any.us-east-1.rds.amazonaws.com',
            port: 5432,
            username: 'postgres',
            password: 't6DzmgjJZBjARvYWDH7F',
            database: 'postgres',
            autoLoadModels: true,
            synchronize: true
        })
    ],
})
export class DatabaseModule {}
