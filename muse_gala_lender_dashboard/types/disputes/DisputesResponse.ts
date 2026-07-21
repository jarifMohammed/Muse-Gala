export interface DisputesResponse {
  disputes: Array<{
    _id: string;
    booking: {
      _id: string;
      customer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profileImage: string;
      };
      lender: string;
      listing: {
        _id: string;
        dressId: string;
      };
      deliveryMethod: string;
      deliveryStatus: string;
    };
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileImage: string;
    };
    issueType: string;
    description: string;
    evidence: Array<{
      filename: string;
      url: string;
    }>;
    status: string;
    timeline: Array<{
      actor: string;
      role: string;
      message: string;
      attachments: Array<{
        filename: string;
        url: string;
      }>;
      type: string;
      timestamp: string;
    }>;
    isEscalated: boolean;
    escalationConfirmed: boolean;
    escalationScheduleCall: boolean;
    policyFlags: string[];
    refundProcessed: boolean;
    escalationEvidence: Array<{
      filename: string;
      url: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  total: number;
  page: number;
  pages: number;
}