export type OperationalSeverity = "info" | "warn" | "error";

export interface OperationalEvent {
  event: string;
  severity?: OperationalSeverity;
  requestId?: string;
  route?: string;
  status?: number;
  durationMs?: number;
  reason?: string;
}

export function logOperationalEvent({
  severity = "info",
  ...event
}: OperationalEvent) {
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    severity,
    ...event,
  });

  if (severity === "error") {
    console.error(payload);
    return;
  }

  if (severity === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}
