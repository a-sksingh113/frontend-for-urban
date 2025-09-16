export function formatDistance(distanceMeters: number): string {
  if (distanceMeters == null || isNaN(distanceMeters)) return "";

  const distanceKm = distanceMeters / 1000;

  if (distanceKm < 1) {
    // Show meters for anything under 1km
    return `${Math.round(distanceMeters)} m away`;
  }

  return `${distanceKm.toFixed(1)} km away`;
}
