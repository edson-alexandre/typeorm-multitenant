import { Connection } from 'typeorm';
import { IncomingHttpHeaders } from 'http';

declare module 'express-serve-static-core' {
    interface Request {
        conn: Connection;
    }
}

declare module 'http' {
    interface IncomingHttpHeaders {
        tenant?: string;
    }
}
