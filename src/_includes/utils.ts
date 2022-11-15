import type { TypeHandler, TypeHandlerError } from '.'

export function trimSlashes(s: string): string {
  return s.replace(/^[/\\\s]+|[/\\\s]+$/g, '')
}

export const create = Object.create

export function getHandlers(...val: any): TypeHandler[] {
  return [].concat(...val).filter((v) => typeof v === 'function')
}

export function getMethods(method: string | string[]): string[] {
  return [].concat(
    ...[].concat(method as any).map((v: any) =>
      v
        .trim()
        .toUpperCase()
        .split(/[^-\w]+/))
  )
}

export function statusCodesFactory(code: number): TypeHandlerError {
  return function(_req, _res, _err): void {
    _res.statusCode = code
    _res.end(_err ? JSON.stringify(_err, null, 2) : '' + code)
  }
}
