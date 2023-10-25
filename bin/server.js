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
const initTpl = require('./tex/initial_tpl.js').initTpl
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ gcDurationBuckets: [0.1, 0.2, 0.3] })

const server = http.createServer(async (request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('ok')
  } else if (request.url === '/dump') {
    memorySnapshot()
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
  } else if (request.url === '/metrics') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    try {
      let metricsPromise = client.register.metrics()
      const metricsString = await metricsPromise
      const metricsBuffer = Buffer.from(metricsString)
      response.end(metricsBuffer)
    } catch (e) {
      console.error('get metrics error', e)
      response.end('metrics default')
    }
  } else if (request.url === '/y-websocket/file/initial') {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk.toString()
    })
    request.on('end', () => {
      const params = JSON.parse(body)
      const docId = params.doc_id
      const projectId = params.project_id
      const initContext = params.file_content
      initTpl(docId, projectId, initContext)
      response.end('success')
    })
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('not match')
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
