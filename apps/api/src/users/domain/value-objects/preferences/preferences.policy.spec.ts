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
});
