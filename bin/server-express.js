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
const metricsRoute = require('./profile/metrics_controller.js')
const server = http.createServer(app)
const express = require('express')

wss.on('connection', setupWSConnection)
server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {WebSocket} ws
   */
  const handleAuth = (ws) => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

app.use(express.json())
app.use('/health', healthRoute)
app.use('/doc', docRoute)
app.use('/profile', profileRoute)
app.use('/metrics', metricsRoute)

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
