#!/usr/bin/env bash
# Usage: misc/deploy-prod.sh
# Build and deploy the package on production server.

set +e

echo "Building..."
yarn build:production

echo "Uploading..."
scp -r build/* archive@app.archive.bbdomain.org:/sites/archive-frontend

echo "Updating SSR server"
ssh archive@app.archive.bbdomain.org "cd /sites/kmedia-mdb && git pull"
ssh archive@app.archive.bbdomain.org "cd /sites/kmedia-mdb && yarn --frozen-lockfile && yarn cache clean"

echo "Restarting SSR server"
ssh archive@app.archive.bbdomain.org "supervisorctl restart archive-ssr"

echo "cleaning previous deployments"
ssh archive@app.archive.bbdomain.org "find /sites/archive-frontend -mtime +30 -type f -exec rm -rf {} \;"
