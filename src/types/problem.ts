export type Place = {
  id: string;
  name: string;
  address?: string;
  maps?: string;
  phone?: string;
  photo?: string;
  rating?: number;
  reviews?: number;
  website?: string;
  availability?: boolean | string;
  distance?: number;
};

export type ServiceType = {
  category: string;
  match: string;
};

export type SubmitProblemResponse = {
  success: boolean;
  message: string;
  problem: {
    id: string;
    userId: string;
    imageUrl: string;
    description: string | null;
    detectedIssue?: string | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
    updatedAt: string;
  };
  places: Place[];
  serviceType: ServiceType;
  tokensRemaining: number;
};
