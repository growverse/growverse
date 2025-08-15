import { User } from '../domain/entities/user.entity.js';
import { UserDocument } from '../infrastructure/mongo/user.model.js';

export function toDomain(doc: UserDocument): User {
  return User.create(doc._id, {
    email: doc.email,
    username: doc.username,
    displayName: doc.displayName ?? undefined,
    avatarUrl: doc.avatarUrl ?? undefined,
    role: doc.role as any,
    subRole: doc.subRole as any,
    status: doc.status as any,
    preferences: doc.preferences,
  });
}

export function toPersistence(user: User) {
  const snap = user.snapshot;
  return {
    _id: snap.id,
    email: snap.email,
    username: snap.username,
    displayName: snap.displayName,
    avatarUrl: snap.avatarUrl,
    role: snap.role,
    subRole: snap.subRole,
    status: snap.status,
    preferences: snap.preferences,
  };
}

export function toResponse(user: User) {
  const snap = user.snapshot;
  const { id, email, username, displayName, avatarUrl, role, subRole, status, preferences } = snap;
  return { id, email, username, displayName, avatarUrl, role, subRole, status, preferences };
}
