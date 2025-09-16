export type Pro = {
  id: string;
  name: string;
  rating: number;
  isOpen: boolean;
  tel?: string;
  bookHref?: string;
  imageUrl?: string;
  distanceKm?: number;
  tags?: string[];
  totalRating: number;
};

export type ResultsModel = {
  category: string;
  locationLabel: string;
  pros: Pro[];
  tokenBalance: number;
};
