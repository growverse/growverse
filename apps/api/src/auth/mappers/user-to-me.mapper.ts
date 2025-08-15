import { Me } from '../domain/value-objects/me.types.js';
import { User } from '../../users/domain/entities/user.entity.js';

export function toMeDto(user: User): Me {
  const snap = user.snapshot;
  const { id, email, username, displayName, avatarUrl, role, subRole, status, preferences } = snap;
  return { id, email, username, displayName, avatarUrl, role, subRole, status, preferences };
}
