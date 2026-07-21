import type {
  Dispute,
  DisputeFormData,
  EscalationFormData,
} from "@/types/disputes";

// Mock data for disputes
const mockDisputes: Dispute[] = [
  {
    id: "DISP-001",
    bookingId: "BK-12345",
    customerId: "CUST-001",
    customerName: "Sophia M.",
    dressId: "MG-XXXXXX",
    dressName: "Black Evening Gown",
    reason: "Late Return",
    description: "The dress was not returned by the due date of Apr 8, 2025.",
    status: "Pending",
    dateSubmitted: "Apr 10, 2025",
    evidence: [
      {
        id: "EV-001",
        disputeId: "DISP-001",
        filename: "evidence1.jpg",
        fileUrl: "/evidence-display.png",
        uploadedAt: "Apr 10, 2025",
      },
      {
        id: "EV-002",
        disputeId: "DISP-001",
        filename: "evidence2.jpg",
        fileUrl: "/evidence-display.png",
        uploadedAt: "Apr 10, 2025",
      },
    ],
    timeline: [
      {
        date: "Apr 12, 2025",
        action: "Dispute Opened",
      },
      {
        date: "Apr 12, 2025",
        action: "Action 1",
        details: "Customer contacted regarding late return.",
      },
      {
        date: "Apr 12, 2025",
        action: "Action 2",
        details: "Late fee added to customer account.",
      },
    ],
  },
  {
    id: "DISP-002",
    bookingId: "BK-67890",
    customerId: "CUST-002",
    customerName: "Emma J.",
    dressId: "DR-54321",
    dressName: "Zimmermann Silk Gown",
    reason: "Not Returned",
    description: "The dress was not returned after the rental period ended.",
    status: "In Progress",
    dateSubmitted: "Apr 5, 2025",
    timeline: [
      {
        date: "Apr 5, 2025",
        action: "Dispute Opened",
      },
      {
        date: "Apr 6, 2025",
        action: "Customer Contacted",
      },
    ],
  },
  {
    id: "DISP-003",
    bookingId: "BK-24680",
    customerId: "CUST-003",
    customerName: "Olivia P.",
    dressId: "DR-97531",
    dressName: "Red Cocktail Dress",
    reason: "Damaged Dress",
    description: "The dress was returned with visible stains on the front.",
    status: "Resolved",
    dateSubmitted: "Mar 20, 2025",
    evidence: [
      {
        id: "EV-003",
        disputeId: "DISP-003",
        filename: "damage_photo.jpg",
        fileUrl: "/placeholder.svg?key=6dhj2",
        uploadedAt: "Mar 20, 2025",
      },
    ],
    timeline: [
      {
        date: "Mar 20, 2025",
        action: "Dispute Opened",
      },
      {
        date: "Mar 22, 2025",
        action: "Damage Assessment",
      },
      {
        date: "Mar 25, 2025",
        action: "Resolved",
        details: "Customer charged cleaning fee.",
      },
    ],
  },
];

// Mock bookings for the dropdown
const mockBookings = [
  {
    id: "BK-12345",
    customerName: "Sophia M.",
    date: "Apr 1, 2025",
    dressId: "MG-XXXXXX",
    dressName: "Black Evening Gown",
  },
  {
    id: "BK-67890",
    customerName: "Emma J.",
    date: "Apr 2, 2025",
    dressId: "DR-54321",
    dressName: "Zimmermann Silk Gown",
  },
  {
    id: "BK-24680",
    customerName: "Olivia P.",
    date: "Mar 15, 2025",
    dressId: "DR-97531",
    dressName: "Red Cocktail Dress",
  },
];

// Mock reasons for dispute
const disputeReasons = [
  { id: "reason-1", label: "Late Return" },
  { id: "reason-2", label: "Not Returned" },
  { id: "reason-3", label: "Damaged Dress" },
  { id: "reason-4", label: "Wrong Size" },
  { id: "reason-5", label: "Quality Issue" },
  { id: "reason-6", label: "Other" },
];

// Mock reasons for escalation
const escalationReasons = [
  { id: "escalation-1", label: "No Response from Customer" },
  { id: "escalation-2", label: "Dispute Unresolved" },
  { id: "escalation-3", label: "Significant Damage" },
  { id: "escalation-4", label: "Item Not Returned" },
  { id: "escalation-5", label: "Need Higher Authority" },
  { id: "escalation-6", label: "Other" },
];

// Get all disputes
export async function getAllDisputes(): Promise<Dispute[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDisputes);
    }, 800);
  });
}

// Get dispute by ID
export async function getDisputeById(id: string): Promise<Dispute | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dispute = mockDisputes.find((d) => d.id === id);
      resolve(dispute || null);
    }, 500);
  });
}

// Create new dispute
export async function createDispute(data: DisputeFormData): Promise<Dispute> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDispute: Dispute = {
        id: `DISP-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        bookingId: data.bookingId,
        customerId: `CUST-${Math.floor(Math.random() * 1000)}`,
        customerName:
          mockBookings.find((b) => b.id === data.bookingId)?.customerName ||
          "Customer",
        dressId:
          mockBookings.find((b) => b.id === data.bookingId)?.dressId ||
          "UNKNOWN",
        dressName: mockBookings.find((b) => b.id === data.bookingId)?.dressName,
        reason: data.reason,
        description: data.description,
        status: "Pending",
        dateSubmitted: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        evidence: data.evidence
          ? data.evidence.map((file, index) => ({
              id: `EV-${Math.floor(Math.random() * 10000)}`,
              disputeId: "",
              filename: file.name,
              fileUrl: "/evidence-display.png",
              uploadedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }))
          : [],
        timeline: [
          {
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            action: "Dispute Opened",
          },
        ],
      };

      mockDisputes.unshift(newDispute);
      resolve(newDispute);
    }, 1000);
  });
}

// Escalate dispute
export async function escalateDispute(
  disputeId: string,
  data: EscalationFormData
): Promise<Dispute> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const disputeIndex = mockDisputes.findIndex((d) => d.id === disputeId);
      if (disputeIndex === -1) {
        reject(new Error("Dispute not found"));
        return;
      }

      const updatedDispute = {
        ...mockDisputes[disputeIndex],
        status: "Escalated" as const,
      };

      // Add to timeline
      if (!updatedDispute.timeline) {
        updatedDispute.timeline = [];
      }

      updatedDispute.timeline.push({
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        action: "Dispute Escalated",
        details: `Reason: ${data.reason}`,
      });

      // Add evidence if provided
      if (data.additionalEvidence && data.additionalEvidence.length > 0) {
        if (!updatedDispute.evidence) {
          updatedDispute.evidence = [];
        }

        data.additionalEvidence.forEach((file) => {
          updatedDispute.evidence?.push({
            id: `EV-${Math.floor(Math.random() * 10000)}`,
            disputeId: disputeId,
            filename: file.name,
            fileUrl: "/evidence-display.png",
            uploadedAt: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          });
        });
      }

      mockDisputes[disputeIndex] = updatedDispute;
      resolve(updatedDispute);
    }, 1000);
  });
}

// Send message to support
export async function sendSupportMessage(
  disputeId: string,
  message: string
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const disputeIndex = mockDisputes.findIndex((d) => d.id === disputeId);
      if (disputeIndex !== -1 && mockDisputes[disputeIndex].timeline) {
        mockDisputes[disputeIndex].timeline?.push({
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          action: "Message Sent",
          details:
            message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        });
      }
      resolve(true);
    }, 500);
  });
}

// Get bookings for dropdown
export async function getBookingsForDropdown() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBookings);
    }, 300);
  });
}

// Get dispute reasons
export function getDisputeReasons() {
  return disputeReasons;
}

// Get escalation reasons
export function getEscalationReasons() {
  return escalationReasons;
}
