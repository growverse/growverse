export type PerformancePreset = 'low' | 'medium' | 'high';

export interface AvatarUserPreferences {
  performancePreset: PerformancePreset;
  timeFormat: '24h' | '12h';
  enableNotifications: boolean;
  enableDarkMode: boolean;
}
