/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
import { TypeIncomingMessage } from '.';
export declare class ParsedUrl {
    _: {
        headers: IncomingHttpHeaders;
        encrypted: any;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
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
