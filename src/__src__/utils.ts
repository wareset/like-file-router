import { TypeHandler, TypeHandlerError } from '.'

export const trimSlashes = (s: string): string =>
  s.replace(/^[/\\\s]+|[/\\\s]+$/g, '')

export const create = Object.create

export const getHandlers = (...val: any): TypeHandler[] =>
  [].concat(...val).filter((v) => typeof v === 'function')

export const getMethods = (method: string | string[]): string[] =>
  [].concat(
    ...[].concat(method as any).map((v: any) =>
      v
        .trim()
        .toUpperCase()
        .split(/[^-\w]+/))
  )

export const statusCodesFactory =
  (code: number): TypeHandlerError => (_req, _res, _err): void => {
    _res.statusCode = code
    _res.end(_err ? JSON.stringify(_err, null, 2) : '' + code)
  }
