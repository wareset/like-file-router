import type { IncomingHttpHeaders } from 'http'

import type { TypeIncomingMessage } from '.'
import { trimSlashes } from '.'

function getHeaderValue(
  value: string | string[] | undefined
): string | null {
  if (value != null && value.length > 0) {
    if (typeof value !== 'string') value = value[0] || ''
    const i = value.lastIndexOf(',')
    return i > -1 ? value.slice(i + 1).trim() : value.trim()
  }
  return null
}

export class ParsedUrl {
  _: {
    encrypted: any
    headers: IncomingHttpHeaders

    protocol: string | null
    host: string | null
    hostname: string | null
    port: string | null

    route: string
    routes: string[]
  }

  path: string
  pathname: string
  search: string
  query: string
  _raw: string
  raw: string

  constructor(req: TypeIncomingMessage) {
    let i: number
    this.raw = this._raw = req.url!

    this.path = this._raw
    this.pathname = this._raw
    if ((i = this._raw.indexOf('?')) > -1) {
      this.pathname = this._raw.slice(0, i)
      this.query = this._raw.slice(i + 1)
      this.search = '?' + this.query
    } else {
      this.search = this.query = ''
    }

    let route = trimSlashes(this.pathname)
    if (route.indexOf('%') > -1) {
      try { route = decodeURIComponent(route) } catch {}
    }

    this._ = {
      encrypted: (req as any).socket.encrypted || (req as any).connection.encrypted,
      headers  : req.headers,
      
      protocol: null,
      host    : null,
      hostname: null,
      port    : null,

      route,
      routes: route.length > 0 ? route.split('/') : []
    }
  }

  get protocol(): string {
    return this._.protocol != null
      ? this._.protocol
      : this._.protocol =
          getHeaderValue(this._.headers['x-forwarded-proto']) ||
          'http' + (this._.encrypted ? 's:' : ':')
  }

  get host(): string {
    return this._.host != null
      ? this._.host
      : this._.host =
          getHeaderValue(this._.headers['x-forwarded-host']) ||
          getHeaderValue(this._.headers.host) ||
          getHeaderValue(this._.headers[':authority']) ||
          ''
  }

  get hostname(): string {
    let i: number
    return this._.hostname != null
      ? this._.hostname
      : this._.hostname = !this.host
        ? ''
        : (i = this._.host!.indexOf(':')) > -1
          ? this._.host!.slice(0, i)
          : this._.host!
  }

  get port(): string {
    let i: number
    return this._.port != null
      ? this._.port
      : this._.port = this.host && (i = this._.host!.indexOf(':')) > -1
        ? this._.host!.slice(i + 1)
        : ''
  }

  get origin(): string {
    return this.protocol + '//' + this.host
  }
  get href(): string {
    return this.origin + this._raw
  }
}
