#!/bin/sh

export HOST=0.0.0.0
export PORT=1234
export YPERSISTENCE=/opt/storage

nohup ./bin/server.js >> ws.log 2>&1 &
nohup node ./bin/http_server.js >> http.log 2>&1 &

tail -f ws.log