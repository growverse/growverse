export interface PortalDestination {
  id: string;
  label: string;
  position: [number, number, number];
}

export interface PortalsConfig {
  destinations: PortalDestination[];
}

export interface WorldConfig {
  dayNight: { cycleSec: number };
  fog: { near: number; far: number };
}

export interface TuningConfig {
  avatar: { walkSpeed: number; runSpeed: number };
  quality: { minFps: number };
}
