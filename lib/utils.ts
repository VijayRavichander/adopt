import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

type Coordinates = {
  lat: number;
  lon: number;
};

/**
 * Return NW (top-left) and SE (bottom-right) coordinates that are
 * `diagonalMiles` away from (lat, lon) along the diagonal.
 */
export function getDiagonalBounds(
  lat: number,
  lon: number,
  diagonalMiles: number = 10
): { topLeft: Coordinates; bottomRight: Coordinates } {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const toDeg = (rad: number): number => (rad * 180) / Math.PI;
  const toKm = (miles: number): number => miles * 1.60934;

  const diagonalKm = toKm(diagonalMiles);
  const angularDistance = diagonalKm / EARTH_RADIUS_KM;
  const sideAngular = angularDistance / Math.SQRT2;

  const dest = (bearingDeg: number): Coordinates => {
    const θ = toRad(bearingDeg);
    const φ1 = toRad(lat);
    const λ1 = toRad(lon);

    const φ2 = Math.asin(
      Math.sin(φ1) * Math.cos(sideAngular) +
        Math.cos(φ1) * Math.sin(sideAngular) * Math.cos(θ)
    );

    const λ2 =
      λ1 +
      Math.atan2(
        Math.sin(θ) * Math.sin(sideAngular) * Math.cos(φ1),
        Math.cos(sideAngular) - Math.sin(φ1) * Math.sin(φ2)
      );

    return { lat: toDeg(φ2), lon: toDeg(λ2) };
  };

  return {
    topLeft: dest(315),       // NW
    bottomRight: dest(135),   // SE
  };
}
