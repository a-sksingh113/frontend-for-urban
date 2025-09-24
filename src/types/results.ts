export type Pro = {
  id: string;
  name: string;
  rating: number;
  isOpen?: boolean;
  tel?: string;
  bookHref?: string;
  imageUrl?: string;
  address?: string;
  mapsHref?: string;
  tags?: string[];
  totalRating?: number;
  distance?: number;
};

export type ResultsModel = {
  category: string;
  locationLabel: string;
  pros: Pro[];
  tokenBalance: number;
};
