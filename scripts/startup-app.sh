#!/bin/sh

export HOST=0.0.0.0
export PORT=1234
export YPERSISTENCE=/opt/data/yjs-storage
# export NODE_OPTIONS="--max-old-space-size=256"

# https://stackoverflow.com/questions/77357320/is-it-possible-to-change-the-node-heap-size
nohup node --max-old-space-size=256 --max-semi-space-size=128 ./bin/server-express.js >> ws.log 2>&1 &

tail -f ws.log