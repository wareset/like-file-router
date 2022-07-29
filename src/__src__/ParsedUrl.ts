import { IncomingHttpHeaders } from 'http'

import { TypeIncomingMessage } from '.'
import { trimSlashes } from '.'

const getHeaderValue = (
  value: string | string[] | undefined
): string | null => {
  if (value !== void 0 && value.length > 0) {
    if (typeof value !== 'string') value = value[0] || ''
    const i = value.lastIndexOf(',')
    return i > -1 ? value.slice(i + 1).trim() : value.trim()
  }
  return null
}

export class ParsedUrl {
  _: {
    headers: IncomingHttpHeaders
    encrypted: boolean
    protocol?: string
    host?: string | null
    hostname?: string | null
    port?: string | null
  }

  path: string
  pathname: string
  search: string | null
  query: string | null
  raw: string
  _raw: string
  _route: string
  _routes: string[]

  constructor(req: TypeIncomingMessage) {
    let i: number
    this._ = {
      headers  : req.headers,
      encrypted: !!(
        (req as any).socket.encrypted || (req as any).connection.encrypted
      ),
      protocol: void 0,
      host    : void 0,
      hostname: void 0,
      port    : void 0
    }
    this.raw = this._raw = req.url!

    this.path = this._raw
    this.pathname = this._raw
    if ((i = this._raw.indexOf('?')) > -1) {
      this.pathname = this._raw.slice(0, i)
      this.query = this._raw.slice(i + 1)
      this.search = '?' + this.query
    } else {
      this.search = this.query = null
    }

    this._route = trimSlashes(this.pathname)
    if (this._route.indexOf('%') > -1) {
      try { this._route = decodeURIComponent(this._route) } catch {}
    }
    this._routes = this._route.length > 0 ? this._route.split('/') : []
  }

  get protocol(): string {
    return this._.protocol !== void 0
      ? this._.protocol
      : this._.protocol =
          getHeaderValue(this._.headers['x-forwarded-proto']) ||
          'http' + (this._.encrypted ? 's' : '')
  }

  get host(): string | null {
    return this._.host !== void 0
      ? this._.host
      : this._.host =
          getHeaderValue(this._.headers['x-forwarded-host']) ||
          getHeaderValue(this._.headers.host) ||
          getHeaderValue(this._.headers[':authority']) ||
          null
  }

  get hostname(): string | null {
    let i: number
    return this._.hostname !== void 0
      ? this._.hostname
      : this._.hostname = !this.host
        ? null
        : (i = this._.host!.indexOf(':')) > -1
          ? this._.host!.slice(0, i)
          : this._.host!
  }

  get port(): string | null {
    let i: number
    return this._.port !== void 0
      ? this._.port
      : this._.port = this.host && (i = this._.host!.indexOf(':')) > -1
        ? this._.host!.slice(i + 1)
        : null
  }
}
