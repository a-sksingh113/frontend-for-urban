type KeyOpts = {
  country?: string;
  lang?: string;
  type?: string;
  lat?: number;
  lng?: number;
  includeQueryPredictions?: boolean;
};

const BUCKET_DEG = 0.02;
const bucket = (n: number, step = BUCKET_DEG) => Math.round(n / step) * step;

export const makeKey = (query: string, opts: KeyOpts = {}) => {
  const q = query.trim().toLowerCase();

  const lat = opts.lat != null ? bucket(opts.lat) : null;
  const lng = opts.lng != null ? bucket(opts.lng) : null;

  return JSON.stringify({
    q,
    country: opts.country ?? null,
    lang: opts.lang ?? null,
    type: opts.type ?? null,
    lat,
    lng,
    includeQueryPredictions: opts.includeQueryPredictions ?? false,
  });
};
