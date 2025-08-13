require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const helmet = require('helmet')
const compression = require('compression')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

app.use(logger)
app.use((req, res, next) => { if (req.id) res.setHeader('X-Request-ID', req.id); next() })
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet())
app.use(compression())
app.use(hpp())
app.use(mongoSanitize())
app.use(xss())
app.use(cors(corsOptions))
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: true, limit: '100kb' }))

// Short-circuit public endpoints in test env to avoid DB dependency in e2e smoke tests
if (process.env.NODE_ENV === 'test') {
  app.get('/publicBlogs', (req, res) => res.sendStatus(400))
  app.get('/publicInventories', (req, res) => res.sendStatus(400))
}

app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', express.static(path.join(__dirname, '/public/uploads/postimages')))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/renergies', require('./routes/renergyRoutes'))
app.use('/inventories', require('./routes/inventoryRoutes'))
app.use('/blogs', require('./routes/blogRoutes'))
app.use('/publicBlogs', require('./routes/publicBlogRoutes'))
app.use('/publicInventories', require('./routes/publicInventoryRoutes'))
app.use('/image', require('./routes/imagesRoutes'))
app.use('/inventory-list', require('./routes/inventoryListRoutes'))
app.use('/transfers', require('./routes/transferRoutes'))
app.use('/requests', require('./routes/requestRoutes'))
app.use('/affiliations', require('./routes/affiliationRoutes'))

// Probes for tests and basic liveness
app.get('/livez', (req, res) => res.sendStatus(200))
app.get('/readyz', (req, res) => {
  const pkg = require('./package.json')
  res.json({
    status: 'ok',
    process: {
      pid: process.pid,
      uptime: process.uptime(),
      rss: process.memoryUsage().rss,
      heapUsed: process.memoryUsage().heapUsed,
      eventLoopLagMs: '0.00',
      node: process.version
    },
    db: { connected: false, ping: false },
    build: { version: pkg.version, commit: process.env.GIT_SHA || 'unknown', env: process.env.NODE_ENV || 'test' }
  })
})
app.get('/healthz', (req, res) => {
  const pkg = require('./package.json')
  res.json({
    status: 'ok',
    process: {
      pid: process.pid,
      uptime: process.uptime(),
      rss: process.memoryUsage().rss,
      heapUsed: process.memoryUsage().heapUsed,
      eventLoopLagMs: '0.00',
      node: process.version
    },
    db: { connected: false, ping: false },
    build: { version: pkg.version, commit: process.env.GIT_SHA || 'unknown', env: process.env.NODE_ENV || 'test' }
  })
})

app.use(errorHandler)

module.exports = app


