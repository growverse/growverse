import { UpdateUserDto } from './update-user.dto.js';

describe('UpdateUserDto', () => {
  it('should create a valid UpdateUserDto with minimal fields', () => {
    const dto: UpdateUserDto = {
      username: 'newusername',
    };

    expect(dto.username).toBe('newusername');
    expect(dto.email).toBeUndefined();
    expect(dto.role).toBeUndefined();
  });

  it('should create a valid UpdateUserDto with all fields', () => {
    const dto: UpdateUserDto = {
      email: 'newemail@test.com',
      username: 'newusername',
      role: 'admin',
      subRole: 'global',
      preferences: {
        audioVolume: 90,
        graphics: 'high',
        notifications: false,
        theme: 'dark',
      },
    };

    expect(dto.email).toBe('newemail@test.com');
    expect(dto.username).toBe('newusername');
    expect(dto.role).toBe('admin');
    expect(dto.subRole).toBe('global');
    expect(dto.preferences?.audioVolume).toBe(90);
    expect(dto.preferences?.graphics).toBe('high');
    expect(dto.preferences?.notifications).toBe(false);
    expect(dto.preferences?.theme).toBe('dark');
  });
});
