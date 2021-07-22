import { Request, Response, NextFunction } from 'express';
import { Connection, createConnections, getConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import Tenant from './Tenant';
import AppError from '../errors/AppError';

dotenv.config();

export default class DBFactory {
    public static async setDatabaseToRequest(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void> {
        const pgConnection = {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || ''),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        };
        const t = new Tenant(pgConnection);
        const tenant = request.headers.tenant || '';
        const tenantExists = await t.getTenant(tenant);

        if (!tenantExists) {
            throw new AppError('Tenant não localizado');
        }

        request.conn = await DBFactory.connection(tenant);

        next();
    }

    public static async connection(
        tenant: string,
        name: string = tenant,
    ): Promise<Connection> {
        try {
            return await getConnection(`${tenant}`);
        } catch (error) {
            await createConnections([
                {
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT || ''),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: ['./src/modules/entities/*.ts'],
                    migrations: ['./src/shared/database/migrations/*.ts'],
                    cli: {
                        migrationsDir: './src/shared/database/migrations',
                    },
                    schema: `${tenant}`,
                    name: `${name}`,
                },
            ]);
            return await getConnection(`${tenant}`);
        }
    }
}
