import { CreateUserDto } from './create-user.dto.js';

describe('CreateUserDto', () => {
  it('should create a valid CreateUserDto', () => {
    const dto: CreateUserDto = {
      email: 'test@test.com',
      username: 'testuser',
      role: 'learner',
      subRole: 'basic',
      password: 'secret',
    };

    expect(dto.email).toBe('test@test.com');
    expect(dto.username).toBe('testuser');
    expect(dto.role).toBe('learner');
    expect(dto.subRole).toBe('basic');
  });

  it('should allow optional preferences', () => {
    const dto: CreateUserDto = {
      email: 'test@test.com',
      username: 'testuser',
      role: 'learner',
      subRole: 'basic',
      password: 'secret',
      preferences: {
        audioVolume: 80,
        language: 'es',
      },
    };

    expect(dto.preferences).toBeDefined();
    expect(dto.preferences?.audioVolume).toBe(80);
    expect(dto.preferences?.language).toBe('es');
  });
});
