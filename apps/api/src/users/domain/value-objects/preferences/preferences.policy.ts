import { DomainError } from '../../errors/domain.error.js';
import { UserPreferences } from './preferences.types.js';

export function validatePreferences(prefs: UserPreferences): void {
  if (prefs.audioVolume < 0 || prefs.audioVolume > 100) {
    throw new DomainError('audioVolume must be between 0 and 100');
  }
  const graphicsValues = ['low', 'medium', 'high'];
  if (!graphicsValues.includes(prefs.graphics)) {
    throw new DomainError('graphics must be low, medium or high');
  }
}
