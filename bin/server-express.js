#!/usr/bin/env node
/**
 * @type {any}
 */
var yWebSocket = require('ws');
var http = require('http');
var wss = new yWebSocket.Server({ noServer: true });
var setupWSConnection = require('./utils.js').setupWSConnection;
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 1234;
var app = require('./common/tex_express.js').app;
var healthRoute = require('./health/health_controller.js');
var docRoute = require('./doc/doc_controller.js');
var profileRoute = require('./profile/profile_controller.js');
var metricsRoute = require('./profile/metrics_controller.js');
var server = http.createServer(app);
var express = require('express');
wss.on('connection', setupWSConnection);
server.on('upgrade', function (request, socket, head) {
    // You may check auth of request here..
    // See https://github.com/websockets/ws#client-authentication
    /**
     * @param {WebSocket} ws
     */
    var handleAuth = function (ws) {
        wss.emit('connection', ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
});
app.use(express.json());
app.use('/health', healthRoute);
app.use('/doc', docRoute);
app.use('/profile', profileRoute);
app.use('/metrics', metricsRoute);
server.listen(port, host, function () {
    console.log("running at '".concat(host, "' on port ").concat(port));
});
