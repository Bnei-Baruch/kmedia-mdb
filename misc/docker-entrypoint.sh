#!/bin/sh

if [ -d "/build_copy" ]; then
  echo "Copying build to /build_copy..."
  rm -rf /build_copy/*
  cp -r /app/build/* /build_copy
fi

node /app/server/index.js
