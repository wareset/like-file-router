import type {
  Server as TypeHttpServer,
  IncomingMessage,
  ServerResponse
} from 'http'

import type { Server as TypeHttpsServer } from 'https'

import type { ParsedUrl } from '.'

// import { ReqGetHeader } from '.'
// import { ResGetHeader, ResSetHeader, ResJson } from '.'

export { TypeHttpServer, TypeHttpsServer }

export interface TypeIncomingMessage extends IncomingMessage {
  parsedUrl: ParsedUrl
  _parsedUrl: ParsedUrl

  baseUrl: string
  originalUrl: string
  params: { [key: string]: string }
}

export interface TypeServerResponse extends ServerResponse {
  locals: { [key: string]: any }
}

export declare type TypeHandler = (
  req: TypeIncomingMessage,
  res: TypeServerResponse,
  next: (err?: any) => void
) => void

export declare type TypeError =
  | number
  | { [key: string]: any; code: number }
  | { [key: string]: any; status: number }
  | { [key: string]: any; statusCode: number }
  | undefined
  | null

export declare type TypeHandlerError = (
    req: TypeIncomingMessage,
    res: TypeServerResponse,
    err?: TypeError,
  ) => void

export declare type TypeRoute = {
    id: number[]
    route: string
    count: number
    spread: boolean
    handlers: TypeHandler[]
    regex: RegExp
  }
