import { User } from './user.entity.js';
import { DEFAULT_PREFERENCES } from '../value-objects/preferences/preferences.types.js';

describe('User entity', () => {
  it('creates with default preferences', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', role: 'learner', subRole: 'basic' });
    expect(user.snapshot.preferences).toEqual(DEFAULT_PREFERENCES);
  });

  it('changes role', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', role: 'learner', subRole: 'basic' });
    user.changeRole('admin', 'global');
    expect(user.snapshot.role).toBe('admin');
  });

  it('updates preferences', () => {
    const user = User.create('1', { email: 'a@a.com', username: 'u1', role: 'learner', subRole: 'basic' });
    user.updatePreferences({ audioVolume: 50 });
    expect(user.snapshot.preferences.audioVolume).toBe(50);
  });
});
