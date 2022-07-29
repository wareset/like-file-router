import { TypeIncomingMessage } from '.'

// https://github.com/expressjs/express/blob/master/lib/request.js

export function ReqGetHeader(this: TypeIncomingMessage, name: string): string {
  const lc = name.toLowerCase()

  switch (lc) {
    case 'referer':
    case 'referrer':
      return '' + (this.headers.referrer || this.headers.referer || '')
    default:
      return '' + (this.headers[lc] || '')
  }
}

function ReqXhr(this: TypeIncomingMessage): boolean {
  return this.get('X-Requested-With').toLowerCase() === 'xmlhttprequest'
}

export const REQ = {
  get   : { value: ReqGetHeader, configurable: true, enumerable: true },
  header: { value: ReqGetHeader, configurable: true, enumerable: true },
  
  xhr: { get: ReqXhr, configurable: true, enumerable: true }
}
