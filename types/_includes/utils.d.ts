import type { TypeHandler, TypeHandlerError } from '.';
export declare function trimSlashes(s: string): string;
export declare const create: {
    (o: object): any;
    (o: object, properties: PropertyDescriptorMap & ThisType<any>): any;
};
export declare function getHandlers(...val: any): TypeHandler[];
export declare function getMethods(method: string | string[]): string[];
export declare function statusCodesFactory(code: number): TypeHandlerError;
