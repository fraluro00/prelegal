#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
docker build -t prelegal .
docker run -d --name prelegal -p 8000:8000 prelegal
echo "Prelegal running at http://localhost:8000"
