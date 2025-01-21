require('dotenv').config();

import {Sequelize} from "sequelize";

export const databaseProvider = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            return (new Sequelize({
                dialect: 'postgres',
                host:     process.env.DB_HOST,
                port:     +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            }));
        },
    }
]