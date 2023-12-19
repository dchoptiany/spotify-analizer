#!/bin/bash
PORT=${1:-3000}
VERSION=${2:-latest}

docker run -d -p ${PORT}:${PORT} --name ui_frontend spotify-insights-ui_frontend:${VERSION}
