import { User } from './user.entity.js';
import { DEFAULT_PREFERENCES } from '../value-objects/preferences/preferences.types.js';

describe('User entity', () => {
  it('creates with default preferences', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', passwordHash: 'hash', role: 'learner', subRole: 'basic' });
    expect(user.snapshot.preferences).toEqual(DEFAULT_PREFERENCES);
    expect(user.snapshot.preferences.notifications).toBe(true);
    expect(user.snapshot.preferences.theme).toBe('light');
  });

  it('changes role', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', passwordHash: 'hash', role: 'learner', subRole: 'basic' });
    user.changeRole('admin', 'global');
    expect(user.snapshot.role).toBe('admin');
  });

  it('updates preferences', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', passwordHash: 'hash', role: 'learner', subRole: 'basic' });
    user.updatePreferences({ audioVolume: 50, notifications: false, theme: 'dark' });
    expect(user.snapshot.preferences.audioVolume).toBe(50);
    expect(user.snapshot.preferences.notifications).toBe(false);
    expect(user.snapshot.preferences.theme).toBe('dark');
  });
});
