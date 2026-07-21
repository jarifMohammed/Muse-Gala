export type DBUser = {
  file: {
    url: string;
    type: string;
  };
  reviewStockMethod: {
    website: boolean;
    instagram: boolean;
    keyBrands: boolean;
  };
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  username: string;
  dob: string | null;
  gender: string;
  role: string;
  bio: string;
  profileImage: string;
  multiProfileImage: string[];
  otp: string | null;
  otpExpires: string | null;
  refreshToken: string;
  isActive: boolean;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  businessName: string;
  abnNumber: string;
  businessAddress: string;
  instagramHandle: string;
  businessWebsite: string;
  numberOfDresses: string;
  allowTryOn: boolean;
  allowLocalPickup: boolean;
  shipAustraliaWide: boolean;
  agreedTerms: boolean;
  agreedCurationPolicy: boolean;
  totalbookings: number;
  totalRatting: number;
  totalListings: number;
  totalReveneue: number;
  city: string;
  state: string;
  country: string;
  postcode: string;
  suburb: string;
  placeName: string;
  latitude: number;
  longitude: number;
  address: string;
  status: string;
  applicationSubmittedAt: string;
  applicationReviewedAt: string;
  notes: string;
  reason: string;
  deactivationReason: string;
  deactivationFeedback: string;
  deactivated: boolean;
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  stripeAccountId: string;
  stripeOnboardingCompleted: boolean;
  kycStatus: string;
  kycVerified: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kycDetails: any; // If you know the structure, replace 'any' with the correct type
  kycLastUpdated: string;
  stripeVerificationSessionExpiresAt: string | null;
  stripeVerificationSessionId: string;
  stripeVerificationSessionUrl: string;
};

export interface ApiResponse {
  status: boolean;
  message: string;
  data: DBUser;
}
