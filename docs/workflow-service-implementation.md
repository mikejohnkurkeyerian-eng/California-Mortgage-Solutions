# Workflow Service Implementation

## Overview

The workflow service is the automation engine that orchestrates loan progression through all stages automatically. It handles state transitions, condition checking, and promotes loans to ClearToClose when ready.

## Architecture

### Core Components

1. **LoanWorkflow Class** (`src/workflows/loan-workflow.ts`)
   - Defines workflow steps and their execution logic
   - Handles retry logic and error recovery
   - Manages state transitions

2. **REST API** (`src/routes.ts`)
   - `/api/execute/:loanId` - Execute workflow for a loan
   - `/api/events/document-uploaded` - Handle document upload events
   - `/api/events/underwriting-decision` - Handle underwriting decisions
   - `/api/events/condition-satisfied` - Handle condition satisfaction
   - `/api/status/:loanId` - Get workflow status

3. **Express Server** (`src/main.ts`)
   - Runs on port 4004 (configurable via PORT env var)
   - Health check endpoint

## Workflow Steps

### 1. Check Document Completeness
- **Trigger**: When loan is in Draft or Submitted stage
- **Action**: Uses document-rules engine to check if all required documents are uploaded
- **Next**: If complete → Submit to Underwriting
- **Retry**: 3 attempts with 5 second delay

### 2. Submit to Underwriting
- **Trigger**: When documents are complete
- **Action**: Updates loan stage to "Underwriting"
- **Next**: Wait for decision

### 3. Wait for Underwriting Decision
- **Trigger**: When loan is in Underwriting stage
- **Action**: Waits for external decision (from underwriter or rules service)
- **Next**: Process decision when received

### 4. Process Underwriting Decision
- **Trigger**: When underwriting decision is made
- **Actions**:
  - **Approved**: Move to ClearToClose
  - **Conditional**: Move to Conditional stage
  - **Rejected**: Stay in Underwriting (marked as rejected)
- **Next**: Check conditions (if conditional)

### 5. Check Underwriting Conditions
- **Trigger**: When loan is in Conditional stage
- **Action**: Checks if all conditions are satisfied
- **Next**: 
  - If all satisfied → Promote to ClearToClose
  - If pending → Keep checking (retries every minute, up to 10 times)

## Event-Driven Architecture

The workflow service responds to events from other services:

### Document Upload Event
When a borrower uploads a document:
1. Document service calls `/api/events/document-uploaded`
2. Workflow checks if documents are now complete
3. If complete, automatically submits to underwriting

### Underwriting Decision Event
When an underwriter makes a decision:
1. Rules service (or manual) calls `/api/events/underwriting-decision`
2. Workflow processes the decision
3. Moves loan to appropriate stage

### Condition Satisfied Event
When a condition is marked as satisfied:
1. Loan service calls `/api/events/condition-satisfied`
2. Workflow re-checks all conditions
3. If all satisfied, promotes to ClearToClose

## Integration Points

### Loan Service Integration
- Loan service triggers workflow when loan is submitted
- Workflow updates loan stage via loan service API

### Document Service Integration
- Document service triggers workflow when document is uploaded
- Workflow checks document completeness

### Future Integrations
- **Rules Service**: Will trigger underwriting decisions
- **Notification Service**: Will send notifications at each stage
- **Integration Service**: Will trigger external API calls

## Usage Examples

### Manual Workflow Execution
```bash
curl -X POST http://localhost:4004/api/execute/loan-123
```

### Trigger on Document Upload
```bash
curl -X POST http://localhost:4004/api/events/document-uploaded \
  -H "Content-Type: application/json" \
  -d '{"loanId": "loan-123", "documentId": "doc-456"}'
```

### Trigger on Underwriting Decision
```bash
curl -X POST http://localhost:4004/api/events/underwriting-decision \
  -H "Content-Type: application/json" \
  -d '{
    "loanId": "loan-123",
    "decision": "Conditional",
    "conditions": [
      {
        "id": "cond-1",
        "type": "PriorToDoc",
        "description": "Provide updated paystub",
        "status": "Pending"
      }
    ]
  }'
```

### Get Workflow Status
```bash
curl http://localhost:4004/api/status/loan-123
```

## Configuration

Environment variables:
- `PORT` - Service port (default: 4004)
- `LOAN_SERVICE_URL` - Loan service URL (default: http://localhost:4002)
- `DOCUMENT_SERVICE_URL` - Document service URL (default: http://localhost:4003)

## Error Handling

- All workflow steps have retry logic
- Errors are logged but don't crash the service
- Failed steps can be retried manually via API

## Future Enhancements

1. **Scheduled Checks**: Periodic checks for loans waiting on conditions
2. **Workflow History**: Track all state transitions with timestamps
3. **Webhooks**: Notify external systems on state changes
4. **Parallel Steps**: Execute multiple steps in parallel
5. **Conditional Branching**: Support complex decision trees
6. **Workflow Visualization**: UI to see workflow progress

## Testing

To test the workflow service:

1. Start all services:
   ```bash
   pnpm --filter @loan-platform/loan-service start
   pnpm --filter @loan-platform/document-service start
   pnpm --filter @loan-platform/workflow-service start
   ```

2. Create a loan application
3. Upload documents
4. Submit loan
5. Watch workflow automatically progress through stages

## Next Steps

1. Add scheduled condition checking (cron job)
2. Integrate with rules service for automatic underwriting decisions
3. Add workflow history/audit trail
4. Create workflow visualization UI

