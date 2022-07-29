import { TypeHandler, TypeHandlerError } from '.';
export declare const trimSlashes: (s: string) => string;
export declare const create: {
    (o: object): any;
    (o: object, properties: PropertyDescriptorMap & ThisType<any>): any;
};
export declare const getHandlers: (...val: any) => TypeHandler[];
export declare const getMethods: (method: string | string[]) => string[];
export declare const statusCodesFactory: (_code: number) => TypeHandlerError;
