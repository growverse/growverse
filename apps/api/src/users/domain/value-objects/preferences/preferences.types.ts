export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface UserPreferences {
  language: string;
  timezone: string;
  graphics: GraphicsQuality;
  audioVolume: number; // 0..100
  micEnabled: boolean;
  chatEnabled: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  timezone: 'UTC',
  graphics: 'medium',
  audioVolume: 70,
  micEnabled: false,
  chatEnabled: true,
};
