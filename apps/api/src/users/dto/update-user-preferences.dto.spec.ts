import { UpdateUserPreferencesDto } from './update-user-preferences.dto.js';

describe('UpdateUserPreferencesDto', () => {
  it('should create a valid UpdateUserPreferencesDto', () => {
    const dto: UpdateUserPreferencesDto = {
      audioVolume: 75,
      graphics: 'high',
      language: 'es',
    };

    expect(dto.audioVolume).toBe(75);
    expect(dto.graphics).toBe('high');
    expect(dto.language).toBe('es');
  });

  it('should allow partial preferences updates', () => {
    const dto: UpdateUserPreferencesDto = {
      audioVolume: 50,
    };

    expect(dto.audioVolume).toBe(50);
    expect(dto.graphics).toBeUndefined();
    expect(dto.language).toBeUndefined();
  });

  it('should allow all preference fields', () => {
    const dto: UpdateUserPreferencesDto = {
      language: 'fr',
      timezone: 'Europe/Paris',
      graphics: 'low',
      audioVolume: 25,
      micEnabled: true,
      chatEnabled: false,
    };

    expect(dto.language).toBe('fr');
    expect(dto.timezone).toBe('Europe/Paris');
    expect(dto.graphics).toBe('low');
    expect(dto.audioVolume).toBe(25);
    expect(dto.micEnabled).toBe(true);
    expect(dto.chatEnabled).toBe(false);
  });
});
