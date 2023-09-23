#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const jwt = require('jsonwebtoken')
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
      // https://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#query-param
      const token = url.searchParams.get('access_token')
      if (!token) {
        let err = new Error('401-NO_TOKEN')
        socket.destroy(err)
        return
      }
      try {
        jwt.verify(token, JWT_SIGN_KEY)
        wss.emit('connection', ws, request)
      } catch (err) {
        console.error('error:' + err)
        socket.destroy(err)
      }
      let err = new Error('200-OK')
      socket.destroy(err)
    }
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
