export interface WorkflowEvent {
  loanId: string;
  eventType:
    | "LoanCreated"
    | "ChecklistCompleted"
    | "SubmittedToUnderwriting"
    | "ConditionsCleared"
    | "ClearToClose";
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface WorkflowClient {
  triggerEvent(event: WorkflowEvent): Promise<void>;
}


