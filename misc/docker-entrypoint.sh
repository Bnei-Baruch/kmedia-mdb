#!/bin/sh

export_build() {
    if [ -d "/build_copy" ]; then
        echo "Copying build to /build_copy..."
        rm -rf /build_copy/*
        cp -r /app/build/* /build_copy
    fi
}

export_build

cmd=${1-web}

case $cmd in

web)
    exec node /app/server/index.js
    ;;

*)
    exec "$@"
    ;;

esac
