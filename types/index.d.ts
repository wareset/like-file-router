/// <reference types="node" />
export { Router, METHODS } from './__src__';
import { Router } from './__src__';
export default Router;
export type { TypeHandler, TypeHandlerError, TypeError, TypeIncomingMessage, TypeServerResponse } from './__src__';
export declare const createRouter: (a_0: import("http").Server | import("https").Server, a_1?: {
    baseUrl?: string;
    use?: (boolean | import("./__src__").TypeHandler)[];
    errors?: {
        [key: string]: import("./__src__").TypeHandlerError;
    };
    errorsFactory?: (code: number) => import("./__src__").TypeHandlerError;
}) => Router;
