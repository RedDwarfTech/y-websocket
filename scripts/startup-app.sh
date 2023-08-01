#!/bin/sh

nohup ./bin/server.js >> ws.log 2>&1 &

tail -f ws.log