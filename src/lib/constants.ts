/** Pipeline for job applications (OEC-style tracking). */
export const APPLICATION_STATUSES = [
  "RECEIVED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "MEDICAL",
  "VISA",
  "DEPLOYED",
  "REJECTED",
] as const;

/** Employer inquiry workflow */
export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUOTE_SENT",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
] as const;

/** Ordered steps shown on /track-application */
export const TRACK_PIPELINE = [
  { key: "RECEIVED", label: "Received" },
  { key: "UNDER_REVIEW", label: "Under review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview" },
  { key: "MEDICAL", label: "Medical" },
  { key: "VISA", label: "Visa" },
  { key: "DEPLOYED", label: "Deployed" },
] as const;

export function trackStepIndex(status: string): number {
  if (status === "REJECTED") {
    return -1;
  }
  const legacy = status === "NEW" ? "RECEIVED" : status;
  const idx = TRACK_PIPELINE.findIndex((s) => s.key === legacy);
  return idx === -1 ? 0 : idx;
}
