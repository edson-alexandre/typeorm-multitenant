import { Request, Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ''),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['./src/modules/**/typeorm/entities/*.ts'],
    cli: {
        migrationsDir: './src/shared/typeorm/migrations',
    },
});
