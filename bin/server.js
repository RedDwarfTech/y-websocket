#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const jwt = require('jsonwebtoken')
const encoding = require('lib0/dist/encoding.cjs')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 1234
const JWT_SIGN_KEY = process.env.JWT_SIGN_KEY || 'key-missing'

const server = http.createServer((request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('ok')
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
  }
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    const url = new URL(request.url, 'wss://ws.poemhub.top')
    if (request.url !== '/healthz') {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, 2)
      ws.send(encoding.toUint8Array(encoder))

      // https://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#query-param
      const token = url.searchParams.get('access_token')
      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
      }
      try {
        jwt.verify(token, JWT_SIGN_KEY)
        wss.emit('connection', ws, request)
      } catch (err) {
        console.error('error:' + err)
      }
    }
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
