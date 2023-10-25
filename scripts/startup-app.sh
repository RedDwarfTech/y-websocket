#!/bin/sh

export HOST=0.0.0.0
export PORT=1234
export YPERSISTENCE=/opt/data/yjs-storage
export NODE_OPTIONS="--max-old-space-size=256"

nohup node --inspect ./bin/server.js >> ws.log 2>&1 &
nohup node --inspect=0.0.0.0:9229 ./bin/http_server.js >> http.log 2>&1 &

tail -f ws.log