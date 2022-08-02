/// <reference types="node" />
import { TypeRoute, TypeHttpServer, TypeHttpsServer, TypeHandler, TypeHandlerError } from '.';
import { statusCodesFactory as statusCodesFactoryDefalut } from '.';
declare const METHODS_LOWERS: string[];
export { METHODS_LOWERS as METHODS };
export declare class Router {
    readonly server: TypeHttpServer | TypeHttpsServer;
    _routes: {
        [key: string]: {
            [key: string]: TypeRoute[];
        } & {
            '-1': {
                [key: string]: TypeRoute[];
            };
        };
    };
    listen: TypeHttpServer['listen'];
    baseUrl: string;
    get: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    head: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    post: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    put: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    delete: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    connect: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    options: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    trace: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    patch: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this;
    _errors: {
        [key: string]: TypeHandlerError;
    };
    _errorsFactory: typeof statusCodesFactoryDefalut;
    constructor(server: TypeHttpServer | TypeHttpsServer, { baseUrl, use, errors, errorsFactory }?: {
        baseUrl?: string;
        use?: TypeHandler[];
        errors?: {
            [key: string]: TypeHandlerError;
        };
        errorsFactory?: (code: number) => TypeHandlerError;
    });
    add(method: string | string[], route: string, ...handlers: TypeHandler[] | TypeHandler[][]): this;
}
