/// <reference types="node" />
import type { IncomingHttpHeaders } from 'http';
import type { TypeIncomingMessage } from '.';
export declare class ParsedUrl {
    _: {
        encrypted: any;
        headers: IncomingHttpHeaders;
        protocol: string | null;
        host: string | null;
        hostname: string | null;
        port: string | null;
        route: string;
        routes: string[];
    };
    path: string;
    pathname: string;
    search: string;
    query: string;
    _raw: string;
    raw: string;
    constructor(req: TypeIncomingMessage);
    get protocol(): string;
    get host(): string;
    get hostname(): string;
    get port(): string;
    get origin(): string;
    get href(): string;
}
