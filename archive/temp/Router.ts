import {
  TypeRoute,
  TypeHttpServer, TypeHttpsServer,
  TypeHandler, TypeHandlerError,
  TypeIncomingMessage, TypeServerResponse
} from '.'

import { statusCodesFactory as statusCodesFactoryDefalut } from '.'
import { create, getHandlers, getMethods, trimSlashes } from '.'

import { createRoute } from '.'
import { ParsedUrl } from '.'

const METHODS = 'get|head|post|put|delete|connect|options|trace|patch'
const METHODS_LOWERS = METHODS.split('|')
const METHODS_UPPERS = METHODS.toUpperCase().split('|')

export { METHODS_LOWERS as METHODS }

export class Router {
  declare _routes: {
    [key: string]: { [key: string]: TypeRoute[] } & { '-1': { [key: string]: TypeRoute[] } }
  }
  declare listen: TypeHttpServer['listen']
  declare baseUrl: string

  declare get: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare head: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare post: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare put: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare delete: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare connect: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare options: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare trace: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this
  declare patch: (route: string, ...handlers: TypeHandler[] | TypeHandler[][]) => this

  declare _errors: { [key: string]: TypeHandlerError }

  constructor(
    readonly server: TypeHttpServer | TypeHttpsServer,
    {
      baseUrl = '',
      use = [] as TypeHandler[],
      errors = {} as { [key: string]: TypeHandlerError },
      errorsFactory = statusCodesFactoryDefalut
    } = {}
  ) {
    const iam = this
    iam._routes = create(null)
    iam.baseUrl = trimSlashes(baseUrl)
    use = getHandlers(use)
    // console.log(iam)

    const _statusCodes = create(null)
    for (const k in errors) {
      if (/* not NaN */ +k === +k) _statusCodes[k] = errors[k]
    }
    iam._errors = errors = _statusCodes

    for (let a = [404, 500], k = a.length; k-- > 0;) {
      if (!(a[k] in errors)) errors[a[k]] = errorsFactory(a[k])
    }

    for (let k = METHODS_LOWERS.length; k-- > 0;) {
      (iam as any)[METHODS_LOWERS[k]] = (iam as any).add.bind(iam, METHODS_UPPERS[k])
    }

    server.on(
      'request',
      (req: TypeIncomingMessage, res: TypeServerResponse): void => {
        req.baseUrl = iam.baseUrl
        req.originalUrl = req.originalUrl || req.url!
        req.parsedUrl = req._parsedUrl = new ParsedUrl(req)

        res.locals = res.locals || create(null)
        
        const method = req.method!.toUpperCase()
        const count = req.parsedUrl._routes.length
        let matches: any = null
        let slug!: TypeRoute

        SEARCH_ROUTE: if (method in iam._routes) {
          if (count in iam._routes[method]) {
            for (let a = iam._routes[method][count], i = 0, l = a.length; i < l; i++) {
              if ((matches = req.parsedUrl._route.match((slug = a[i]).regex)) != null) {
                break SEARCH_ROUTE
              }
            }
          }
          for (let j = count; j >= 0; j--) {
            if (j in iam._routes[method][-1]) {
              for (let a = iam._routes[method][-1][j], i = 0, l = a.length; i < l; i++) {
                if ((matches = req.parsedUrl._route.match((slug = a[i]).regex)) != null) {
                  break SEARCH_ROUTE
                }
              }
            }
          }
        }

        const handlers = [use]

        if (matches != null) {
          req.params = matches.groups || create(null)
          handlers[1] = slug.handlers
        } else {
          req.params = create(null)
        }

        let i = -1, j = 0
        const next = (err?: any): void => {
          if (err != null) {
            const code = +err || +err.code || +err.status || +err.statusCode || 500
            ;(errors[code] || (errors[code] = errorsFactory(code)))(req, res, err)
          } else if (++i in handlers[j]) {
            handlers[j][i](req, res, next)
          } else if (++j < handlers.length) {
            handlers[j][i = 0] ? handlers[j][i](req, res, next) : next()
          } else {
            errors[handlers.length < 2 ? 404 : 500](req, res)
          }
        }
        next()
        // setImmediate(next)
      }
    )

    iam.listen = server.listen.bind(server)
  }

  add(
    method: string | string[],
    route: string,
    ...handlers: TypeHandler[] | TypeHandler[][]
  ): this {
    const iam = this
    const slug = createRoute(route, getHandlers(...handlers), iam.baseUrl)

    for (let types = getMethods(method),
      type: string, obj: any, routes: any[], k: number,
      i = 0; i < types.length; i++) {
      obj = (type = types[i]) in iam._routes ? iam._routes[type]
        : (iam._routes[type] = create(null),
        iam._routes[type][-1] = create(null), iam._routes[type])

      if (!slug.spread) {
        routes = slug.count in obj
          ? obj[slug.count] : obj[slug.count] = []
      } else {
        routes = slug.count in obj[-1]
          ? obj[-1][slug.count] : obj[-1][slug.count] = []
      }

      // k = 0
      // for (let id2: any, res = 0; k < routes.length; k++) {
      //   id2 = routes[k].id
      //   for (let i = 0; i < id2.length; i++) {
      //     if (i > slug.id.length || (res = slug.id[i] - id2[i]) !== 0) break
      //   }
      //   if ((res !== 0 ? res : id2.length - slug.id.length) < 0) break
      // }
      // routes.splice(k, 0, slug)

      k = 0
      for (let id = slug.id, id2: any, res = 0; k < routes.length; k++) {
        id2 = routes[k].id
        for (let i = 0; i < id.length; i++) {
          if (i > id2.length || (res = id2[i] - id[i]) !== 0) break
        }
        if ((res !== 0 ? res : id2.length - id.length) > 0) break
      }
      routes.splice(k, 0, slug)
    }

    return iam
  }
}
