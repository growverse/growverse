import { DomainError } from '../../errors/domain.error.js';
import { UserPreferences } from './preferences.types.js';

export function validatePreferences(prefs: UserPreferences): void {
  if (!prefs.language.trim()) {
    throw new DomainError('language is required');
  }
  if (!prefs.timezone.trim()) {
    throw new DomainError('timezone is required');
  }
  if (prefs.audioVolume < 0 || prefs.audioVolume > 100) {
    throw new DomainError('audioVolume must be between 0 and 100');
  }
  const graphicsValues = ['low', 'medium', 'high'];
  if (!graphicsValues.includes(prefs.graphics)) {
    throw new DomainError('graphics must be low, medium or high');
  }
  if (typeof prefs.notifications !== 'boolean') {
    throw new DomainError('notifications must be boolean');
  }
  const themeValues = ['dark', 'light'];
  if (!themeValues.includes(prefs.theme)) {
    throw new DomainError('theme must be dark or light');
  }
}
