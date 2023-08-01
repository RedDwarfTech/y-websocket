#!/bin/sh

nohup npx y-websocket >> ws.log 2>&1 &

tail -f ws.log