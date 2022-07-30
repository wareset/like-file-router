console.clear()
console.log('like-file-router/samples/01.js')

// const nodeFs = require('fs')
// const nodePath = require('path')

const { createServer } = require('http')
const { createRouter } = require('../index.js')

const { parse: queryParse } = require('querystring')

const router = createRouter(createServer(), {
  use: [

    // query
    (req, _res, next) => {
      req.query = req.parsedUrl.query != null ? queryParse(req.parsedUrl.query) : {}
      next()
    },

    // body
    (req, _res, next) => {
      // req.setEncoding('utf8')
      const buffers = []
      req.on('data', (chunk) => { buffers.push(chunk) })
      req.on('end', () => {
        const raw = Buffer.concat(buffers).toString()
        if (raw.length) {
          req.body = { raw }
          if (/^\s*[-"\d[{]|^\s*(?:null|true|false)\s*$/.test(raw)) {
            try {
              req.body = JSON.parse(raw)
              next()
            } catch (e) {
              console.log([raw])
              console.error(e)
              next()
            }
          }
        } else {
          next()
        }
      })
    },

    (req, res, next) => {
      console.log(req)
      console.log(res)
      next()
    },
  ],

  errors: {
    404: (_req, res, err) => {
      console.log(404, err)
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Page Not Found')
    }
  }
})

// router.get('/', (_req, res) => {
//   res.end('Index page')
// })

// const ico = nodePath.join(__dirname, 'favicon.ico')
// router.get('/favicon.ico', (_req, res) => {
//   res.writeHead(200, { 'Content-Type': 'image/x-icon' })
//   res.end(nodeFs.createReadStream(ico))
// })

// router.get('a/[id]', (_req, res) => {
//   res.end('Page a/[id]')
// })

const __get__ = (route) => {
  router.get(route, (_req, res) => {
    res.end('Page ' + route)
  })
}

__get__('a/b/[...slug]')
__get__('a/b/c-[...slug]')
__get__('a/b/[...slug]-c')
__get__('a/b/[...c]-[...slug]')
__get__('a/b/[...c]-[...slug]-[...d]')

__get__('a/b/c')
__get__('a/b/c3')
router.get('a/b/c2', (_req, _res, next) => { next() })
__get__('a/b/[slug]')
__get__('a/b/[slug([0-9]+)]')
__get__('a/b/c-[slug]')
__get__('a/b/c-[slug]-c')
__get__('a/b/[slug]-c')
__get__('a/b/[c]-[slug]')
__get__('a/b/[c][slug][d]')
__get__('a/b/[c]-[slug]-[d(\\w+)]')
__get__('a/b/c-[slug]-[d]-[e]-[f]-[g]-[zx]-[aa]-[a]-[axa]-[az]-[aab]-[ab]-[axba]-[azb]')

router.listen(3000)

console.log(router)
console.log(router._routes.GET[3].forEach((v) => console.log(v.route)))
