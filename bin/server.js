#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const fs = require('fs')
const v8 = require('v8')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 1234

const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
const Registry = client.Registry
const register = new Registry()
collectDefaultMetrics({ register })

const server = http.createServer((request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('ok')
  } else if (request.url === '/dump') {
    memorySnapshot()
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
  }
})

const memorySnapshot = () => {
  const snapshotStream = v8.getHeapSnapshot()
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `/opt/data/y-websocket-dump/${Date.now()}.heapsnapshot`
  const fileStream = fs.createWriteStream(fileName)
  snapshotStream.pipe(fileStream)
}

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

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
