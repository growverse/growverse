export type GraphicsQuality = 'low' | 'medium' | 'high';
export interface UserPreferences {
  language: string;
  timezone: string;
  graphics: GraphicsQuality;
  audioVolume: number;
  micEnabled: boolean;
  chatEnabled: boolean;
}
export interface UserSnapshot {
  id: string;
  displayName?: string;
  role: 'admin' | 'instructor' | 'learner';
  subRole: string;
  preferences: UserPreferences;
}
