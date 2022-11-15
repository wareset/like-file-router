import type {
  Server as TypeHttpServer,
  IncomingMessage,
  ServerResponse
} from 'http'

import type { Server as TypeHttpsServer } from 'https'

import type { ParsedUrl } from '.'

// import { ReqGetHeader } from '.'
// import { ResGetHeader, ResSetHeader, ResJson } from '.'

export type { TypeHttpServer, TypeHttpsServer }

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

export type TypeHandler = (
  req: TypeIncomingMessage,
  res: TypeServerResponse,
  next: (err?: any) => void
) => void

export type TypeError =
  | number
  | { [key: string]: any; code: number }
  | { [key: string]: any; status: number }
  | { [key: string]: any; statusCode: number }
  | undefined
  | null

export type TypeHandlerError = (
    req: TypeIncomingMessage,
    res: TypeServerResponse,
    err?: TypeError,
  ) => void

export type TypeRoute = {
    id: number[]
    route: string
    count: number
    spread: boolean
    handlers: TypeHandler[]
    regex: RegExp
  }
