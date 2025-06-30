#!/usr/bin/env bash

# Example: Run backend and frontend together

echo "Starting backend..."
nodemon backend/index.js &

echo "Starting frontend..."
cd frontend && npm start &

# Wait so script doesn't exit immediately
wait
