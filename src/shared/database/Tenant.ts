import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

interface PGConnection {
    hos?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
}

export default class Tenant {
    private client: Client;

    constructor(pgConnection: PGConnection) {
        this.client = new Client(pgConnection);
    }

    public async getTenants(): Promise<string[]> {
        await this.client.connect();
        const schemas = await this.client
            .query(
                `SELECT schema_name
                   FROM information_schema.schemata
                  WHERE schema_name not in ('pg_toast',
                                            'pg_temp_1',
                                            'pg_toast_temp_1',
                                            'pg_catalog',
                                            'information_schema',
                                            'publicsss') order by schema_name`,
            )
            .then(async res => {
                return res.rows.map(schema => schema.schema_name);
            });
        await this.client.end();

        return schemas;
    }

    public async getTenant(tenantName: string): Promise<string> {
        await this.client.connect();
        const schema = await this.client
            .query({
                text: `SELECT schema_name
                         FROM information_schema.schemata
                         WHERE schema_name=$1
                           AND schema_name not in ('pg_toast',
                                                    'pg_temp_1',
                                                    'pg_toast_temp_1',
                                                    'pg_catalog',
                                                    'information_schema',
                                                    'publicsss') order by schema_name`,
                values: [tenantName],
            })
            .then(async res => {
                return res.rows.map(schema => schema.schema_name)[0];
            });
        await this.client.end();

        return schema;
    }
}
