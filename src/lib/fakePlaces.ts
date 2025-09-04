export type PlaceSuggestion = {
  id: string;
  description: string;
  lat: number;
  lng: number;
  postcode?: string;
  city?: string;
  country?: string;
};

const PLACES: PlaceSuggestion[] = [
  {
    id: "1",
    description: "221B Baker Street, London NW1 6XE, UK",
    postcode: "NW1 6XE",
    city: "London",
    country: "UK",
    lat: 51.523771,
    lng: -0.158539,
  },
  {
    id: "2",
    description: "10 Downing Street, London SW1A 2AA, UK",
    postcode: "SW1A 2AA",
    city: "London",
    country: "UK",
    lat: 51.5033635,
    lng: -0.1276248,
  },
  {
    id: "3",
    description: "Buckingham Palace, London SW1A 1AA, UK",
    postcode: "SW1A 1AA",
    city: "London",
    country: "UK",
    lat: 51.501364,
    lng: -0.14189,
  },
  {
    id: "4",
    description: "Piccadilly Circus, London W1J 9HS, UK",
    postcode: "W1J 9HS",
    city: "London",
    country: "UK",
    lat: 51.510067,
    lng: -0.133869,
  },
  {
    id: "5",
    description: "Manchester City Centre, M1 2WD, UK",
    postcode: "M1 2WD",
    city: "Manchester",
    country: "UK",
    lat: 53.479489,
    lng: -2.245115,
  },
  {
    id: "6",
    description: "Birmingham New Street, B2 4QA, UK",
    postcode: "B2 4QA",
    city: "Birmingham",
    country: "UK",
    lat: 52.477781,
    lng: -1.898575,
  },
  {
    id: "7",
    description: "Leeds City Centre, LS1 5ES, UK",
    postcode: "LS1 5ES",
    city: "Leeds",
    country: "UK",
    lat: 53.799638,
    lng: -1.549122,
  },
  {
    id: "8",
    description: "Edinburgh Old Town, EH1 1YZ, UK",
    postcode: "EH1 1YZ",
    city: "Edinburgh",
    country: "UK",
    lat: 55.94962,
    lng: -3.19001,
  },
];

export async function searchFakePlaces(q: string): Promise<PlaceSuggestion[]> {
  const query = q.trim().toLowerCase();
  if (!query) return [];

  await new Promise((r) => setTimeout(r, 200));

  const results = PLACES.filter((p) => {
    const hay = `${p.description} ${p.postcode ?? ""} ${
      p.city ?? ""
    }`.toLowerCase();
    return hay.includes(query);
  }).slice(0, 6);

  return results;
}
