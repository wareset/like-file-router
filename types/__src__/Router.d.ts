/// <reference types="node" />
/// <reference types="node" />
import { TypeRoute, TypeHttpServer, TypeHttpsServer, TypeHandler, TypeHandlerError } from '.';
import { statusCodesFactory as statusCodesFactoryDefalut } from '.';
declare const METHODS_LOWERS: string[];
export { METHODS_LOWERS as METHODS };
declare type TypeMaybeHandlerList = (TypeHandler | null | undefined | boolean)[];
declare type TypeMaybeHandlers = TypeMaybeHandlerList | TypeMaybeHandlerList[];
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
    _baseUrl: string;
    _errors: {
        [key: string]: TypeHandlerError;
    };
    _errorsFactory: typeof statusCodesFactoryDefalut;
    get: (route: string, ...handlers: TypeMaybeHandlers) => this;
    head: (route: string, ...handlers: TypeMaybeHandlers) => this;
    post: (route: string, ...handlers: TypeMaybeHandlers) => this;
    put: (route: string, ...handlers: TypeMaybeHandlers) => this;
    delete: (route: string, ...handlers: TypeMaybeHandlers) => this;
    connect: (route: string, ...handlers: TypeMaybeHandlers) => this;
    options: (route: string, ...handlers: TypeMaybeHandlers) => this;
    trace: (route: string, ...handlers: TypeMaybeHandlers) => this;
    patch: (route: string, ...handlers: TypeMaybeHandlers) => this;
    constructor(server: TypeHttpServer | TypeHttpsServer, { baseUrl, use, errors, errorsFactory }?: {
        baseUrl?: string;
        use?: TypeMaybeHandlerList;
        errors?: {
            [key: string]: TypeHandlerError;
        };
        errorsFactory?: (code: number) => TypeHandlerError;
    });
    listen(...a: Parameters<TypeHttpServer['listen']>): TypeHttpServer | TypeHttpsServer;
    add(method: string | string[], route: string, ...handlers: TypeMaybeHandlers): this;
}
