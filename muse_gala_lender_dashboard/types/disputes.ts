export interface Dispute {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  dressId: string;
  dressName?: string;
  reason: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved" | "Escalated" | "Closed";
  dateSubmitted: string;
  evidence?: DisputeEvidence[];
  timeline?: TimelineEvent[];
}

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  filename: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  date: string;
  action: string;
  details?: string;
}

export interface DisputeFormData {
  bookingId: string;
  reason: string;
  description: string;
  evidence?: File[];
}

export interface EscalationFormData {
  reason: string;
  description: string;
  additionalEvidence?: File[];
  priorityLevel: "Standard" | "High";
  contactInfo: string;
  password: string;
  understand: boolean;
  scheduleFollowUp: boolean;
}

export interface BookingOption {
  id: string;
  customerName: string;
  date: string;
  dressId: string;
  dressName: string;
}

export interface ReasonOption {
  id: string;
  label: string;
}
