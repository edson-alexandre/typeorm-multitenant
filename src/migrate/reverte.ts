import * as dotenv from 'dotenv';
import { Client } from 'pg';
import { getConnection, createConnections } from 'typeorm';

dotenv.config();

const getTenants = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || ''),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    await client.connect();
    const schemas = await client
        .query(
            `SELECT schema_name
               FROM information_schema.schemata
               WHERE schema_name not in ('pg_toast',
                                         'pg_temp_1',
                                         'pg_toast_temp_1',
                                         'pg_catalog',
                                         'information_schema',
                                         'public')
               ORDER BY 1`,
        )
        .then(async res => {
            return res.rows.map(schema => schema.schema_name);
        });
    await client.end();

    return schemas;
};

const latest = async () => {
    const schemas = await getTenants();
    schemas.forEach(async schema => {
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
                schema: `${schema}`,
                name: `${schema}`,
            },
        ]);
        const conn = await getConnection(schema);
        conn.undoLastMigration();
        console.log(`Última migração revertida para o schema: ${schema}`);
    });
};

latest();
