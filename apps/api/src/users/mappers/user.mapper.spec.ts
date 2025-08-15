import { User } from '../domain/entities/user.entity.js';
import { toDomain, toPersistence, toResponse } from './user.mapper.js';

describe('UserMapper', () => {
  const mockUser = User.create('test-id', {
    email: 'test@test.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: 'learner',
    subRole: 'basic',
  } as any);

  const mockUserDoc = {
    _id: 'test-id',
    email: 'test@test.com',
    username: 'testuser',
    passwordHash: 'hash',
    role: 'learner',
    subRole: 'basic',
    preferences: {
      language: 'en',
      timezone: 'UTC',
      graphics: 'medium',
      audioVolume: 70,
      micEnabled: false,
      chatEnabled: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: () => ({
      _id: 'test-id',
      email: 'test@test.com',
      username: 'testuser',
      passwordHash: 'hash',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 70,
        micEnabled: false,
        chatEnabled: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  };

  describe('toDomain', () => {
    it('should map document to domain entity', () => {
      const result = toDomain(mockUserDoc as any);

      expect(result).toBeInstanceOf(User);
      expect(result.snapshot.id).toBe('test-id');
      expect(result.snapshot.email).toBe('test@test.com');
      expect(result.snapshot.username).toBe('testuser');
      expect(result.snapshot.role).toBe('learner');
      expect(result.snapshot.subRole).toBe('basic');
    });
  });

  describe('toPersistence', () => {
    it('should map domain entity to persistence format', () => {
      const result = toPersistence(mockUser);

      expect(result._id).toBe('test-id');
      expect(result.email).toBe('test@test.com');
      expect(result.username).toBe('testuser');
      expect(result.role).toBe('learner');
      expect(result.subRole).toBe('basic');
      expect(result.preferences).toBeDefined();
    });
  });

  describe('toResponse', () => {
    it('should map domain entity to response format', () => {
      const result = toResponse(mockUser);

      expect(result.id).toBe('test-id');
      expect(result.email).toBe('test@test.com');
      expect(result.username).toBe('testuser');
      expect(result.role).toBe('learner');
      expect(result.subRole).toBe('basic');
      expect(result.preferences).toBeDefined();
    });
  });
});
