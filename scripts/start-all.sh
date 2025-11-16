#!/bin/bash

# Start all services for the loan automation platform
# Run this from the root directory

echo "Starting Loan Automation Platform Services..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed. Please install it with: npm install -g pnpm"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Start services in background
echo "Starting Loan Service (port 4002)..."
cd services/loan-service
pnpm start &
LOAN_PID=$!
cd ../..

echo "Starting Document Service (port 4003)..."
cd services/document-service
pnpm start &
DOCUMENT_PID=$!
cd ../..

echo "Starting Workflow Service (port 4004)..."
cd services/workflow-service
pnpm start &
WORKFLOW_PID=$!
cd ../..

echo ""
echo "All services started!"
echo ""
echo "Service PIDs:"
echo "  Loan Service: $LOAN_PID"
echo "  Document Service: $DOCUMENT_PID"
echo "  Workflow Service: $WORKFLOW_PID"
echo ""
echo "To stop all services, run: kill $LOAN_PID $DOCUMENT_PID $WORKFLOW_PID"
echo ""
echo "Health checks:"
echo "  Loan Service: http://localhost:4002/health"
echo "  Document Service: http://localhost:4003/health"
echo "  Workflow Service: http://localhost:4004/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $LOAN_PID $DOCUMENT_PID $WORKFLOW_PID 2>/dev/null; exit" INT TERM
wait

