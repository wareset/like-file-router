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

router.get('a/b/[...slug]', (_req, res) => {
  res.end('Page a/b/[slug]')
})

router.get('a/b/c-[...slug]', (_req, res) => {
  res.end('Page a/b/c-[slug]')
})

router.get('a/b/[...slug]-c', (_req, res) => {
  res.end('Page a/b/[slug]-c')
})

router.get('a/b/[...c]-[...slug]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]')
})

router.get('a/b/[...c]-[...slug]-[...d]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]-[d]')
})

router.get('a/b/c', (_req, res) => {
  res.end('Page a/b/c')
})

router.get('a/b/c2', (_req, _res, next) => {
  next()
})

router.get('a/b/[slug]', (_req, res) => {
  res.end('Page a/b/[slug]')
})

router.get('a/b/[slug([0-9]+)]', (_req, res) => {
  res.end('Page a/b/[slug]')
})

router.get('a/b/c-[slug]', (_req, res) => {
  res.end('Page a/b/c-[slug]')
})

router.get('a/b/[slug]-c', (_req, res) => {
  res.end('Page a/b/[slug]-c')
})

router.get('a/b/[c]-[slug]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]')
})

router.get('a/b/[c][slug][d]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]-[d]')
})

router.get('a/b/[c]-[slug]-[d(\\w+)]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]-[d]-[e]')
})

router.get('a/b/[c]-[slug]-[d]-[e]-[f]-[g]-[zx]-[aa]-[a]-[axa]-[az]-[aab]-[ab]-[axba]-[azb]', (_req, res) => {
  res.end('Page a/b/[c]-[slug]-[d]-[e]')
})

router.get('a/b/c', (_req, res) => {
  res.end('Page a/b/c')
})

router.get('a/b/c2', (_req, _res, next) => {
  next()
})

// router.get('a/[id]/[slug]', (_req, res) => {
//   res.end('Page a/[id]/[slug]')
// })

router.listen(3000)

console.log(router)
console.log(router._routes.GET[3].forEach((v) => console.log(v.route)))
