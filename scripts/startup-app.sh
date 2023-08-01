#!/bin/sh

export HOST=0.0.0.0
export PORT=1234
nohup ./bin/server.js >> ws.log 2>&1 &

tail -f ws.log