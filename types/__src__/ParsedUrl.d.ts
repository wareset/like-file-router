/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
import { TypeIncomingMessage } from '.';
export declare class ParsedUrl {
    _: {
        headers: IncomingHttpHeaders;
        encrypted: boolean;
        protocol?: string;
        host?: string | null;
        hostname?: string | null;
        port?: string | null;
    };
    path: string;
    pathname: string;
    search: string | null;
    query: string | null;
    raw: string;
    _raw: string;
    _route: string;
    _routes: string[];
    constructor(req: TypeIncomingMessage);
    get protocol(): string;
    get host(): string | null;
    get hostname(): string | null;
    get port(): string | null;
}
