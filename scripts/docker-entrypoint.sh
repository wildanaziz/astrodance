#!/bin/sh
set -e

MAX_RETRIES=30
RETRY_INTERVAL=2
RETRIES=0

echo "Waiting for database to be ready..."
while [ $RETRIES -lt $MAX_RETRIES ]; do
  if bun -e "const { Pool } = require('pg'); const p = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 }); p.query('SELECT 1').then(() => { p.end(); process.exit(0); }).catch(() => { p.end(); process.exit(1); });" 2>/dev/null; then
    echo "Database is ready!"
    break
  fi
  RETRIES=$((RETRIES + 1))
  echo "Database not ready, retrying ($RETRIES/$MAX_RETRIES)..."
  sleep $RETRY_INTERVAL
done

if [ $RETRIES -ge $MAX_RETRIES ]; then
  echo "ERROR: Database did not become ready in time"
  exit 1
fi

echo "Running database migrations..."
bun run /app/scripts/run-migrations.mjs

echo "Starting application..."
exec bun run /app/dist/server/entry.mjs
