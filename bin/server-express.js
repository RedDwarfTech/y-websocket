#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 1234
const app = require('./common/tex_express.js').app
const healthRoute = require('./health/health_controller.js')
const docRoute = require('./doc/doc_controller.js')
const profileRoute = require('./profile/profile_controller.js')
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ gcDurationBuckets: [0.1, 0.2, 0.3] })
const server = http.createServer(app)

wss.on('connection', setupWSConnection)
server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

app.use('/health', healthRoute)
app.use('/doc', docRoute)
app.use('/profile', profileRoute)

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
