export type LoginResponse = {
  status: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: "LENDER" | "ADMIN" | "USER" | "APPLICANT"; // You can expand this union if roles are limited
      profileImage: string;
      refreshToken: string;
      updatedAt: string; // ISO timestamp string
    };
    accessToken: string;
  };
};
