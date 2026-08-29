#!/usr/bin/env bash
# Start the Digital Library stack locally: MySQL + Redis services, backend (3000), frontend (3001).
# Usage: ./start.sh

set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Ensure MySQL and Redis services are running (no-op if already started)
brew services start mysql >/dev/null 2>&1 || true
brew services start redis >/dev/null 2>&1 || true

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  wait 2>/dev/null
  echo "Done."
}
trap cleanup INT TERM EXIT

# 2. Backend with hot-reload (nodemon) on port 3000
echo "Starting backend on http://localhost:3000 ..."
(cd "$ROOT_DIR/backend" && npm run dev) &
BACKEND_PID=$!

# 3. Frontend (CRA dev server) on port 3001
echo "Starting frontend on http://localhost:3001 ..."
(cd "$ROOT_DIR/frontend" && PORT=3001 npm start) &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Press Ctrl+C to stop both."
wait
