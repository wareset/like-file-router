import type { TypeServerResponse } from '.'
import { stringify } from '.'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ResGetHeader(this: TypeServerResponse, field: string) {
  return this.getHeader(field)
}

export function ResSetHeader(
  this: TypeServerResponse,
  field: string, val: string | string[]
): TypeServerResponse {
  this.setHeader(field, '' + val)
  return this
}

export function ResJson(
  this:TypeServerResponse,
  s: any
): ReturnType<TypeServerResponse['end']> {
  this.writeHead(200, { 'Content-Type': 'application/json' })
  return this.end(stringify(s))
}

export const RES = {
  get   : { value: ResGetHeader, configurable: true, enumerable: true },
  set   : { value: ResSetHeader, configurable: true, enumerable: true },
  header: { value: ResSetHeader, configurable: true, enumerable: true },
  
  json: { value: ResJson, configurable: true, enumerable: true }
}
