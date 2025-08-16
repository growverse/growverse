import { validatePreferences } from './preferences.policy.js';
import { DEFAULT_PREFERENCES } from './preferences.types.js';

describe('preferences.policy', () => {
  it('accepts defaults', () => {
    expect(() => validatePreferences(DEFAULT_PREFERENCES)).not.toThrow();
  });

  it('rejects volume out of range', () => {
    expect(() => validatePreferences({ ...DEFAULT_PREFERENCES, audioVolume: 200 })).toThrow();
  });

  it('rejects invalid graphics', () => {
    expect(() => validatePreferences({ ...DEFAULT_PREFERENCES, graphics: 'ultra' as any })).toThrow();
  });

  it('rejects invalid theme', () => {
    expect(() => validatePreferences({ ...DEFAULT_PREFERENCES, theme: 'blue' as any })).toThrow();
  });

  it('rejects non-boolean notifications', () => {
    expect(() => validatePreferences({ ...DEFAULT_PREFERENCES, notifications: 'yes' as any })).toThrow();
  });
});
