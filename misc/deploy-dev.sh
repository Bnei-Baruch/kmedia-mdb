#!/usr/bin/env bash
# Usage: misc/release.sh
# Build package, tag a commit, push it to origin, and then deploy the
# package on production server.

set +e

echo "Building..."
yarn build:staging

echo "Uploading..."
scp -r build/* archive@archive-dev.bbdomain.org:/sites/archive-frontend

echo "Updating SSR server"
ssh archive@archive-dev.bbdomain.org "cd /sites/kmedia-mdb && git pull"
ssh archive@archive-dev.bbdomain.org "cd /sites/kmedia-mdb && yarn --frozen-lockfile && yarn cache clean"

echo "Restarting SSR server"
ssh archive@archive-dev.bbdomain.org "supervisorctl restart archive-ssr"

echo "cleaning previous deployments"
ssh archive@archive-dev.bbdomain.org "find /sites/archive-frontend -mtime +30 -type f -exec rm -rf {} \;"
