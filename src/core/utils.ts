export const deg = (rad: number): number => (rad * 180) / Math.PI;

export const fmt = (n: number): string => Number(n).toFixed(2);

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
