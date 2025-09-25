#!/usr/bin/env bash
set -euo pipefail

echo "Stopping dev servers (ports 3000/3001) if running..."

# Kill listeners on ports 3000 and 3001 (macOS)
lsof -nP -iTCP:3000 -sTCP:LISTEN -t | xargs -r kill -9 || true
lsof -nP -iTCP:3001 -sTCP:LISTEN -t | xargs -r kill -9 || true

# Kill known processes by command line
pkill -f "server/index.js" || true
pkill -f "react-scripts start" || true
pkill -f "nodemon" || true

echo "Done."



