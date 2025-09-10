export interface User {
  id: string;
  email: string;
  fullName: string | null;
  profilePhoto: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  googleId: string | null;
  isVerified: boolean;
  isTwoFactorAuthEnable: boolean;
  hasPremiumAccess: boolean;
  tokensRemaining: number;
  tokenUsed: number;
  requestCount: number;
  createdAt: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}
