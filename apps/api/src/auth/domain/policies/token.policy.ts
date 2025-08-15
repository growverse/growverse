import { JwtClaims } from '../value-objects/token.types.js';
import { DomainError } from '../../../users/domain/errors/domain.error.js';
import { User } from '../../../users/domain/entities/user.entity.js';

const ROLES = ['admin', 'instructor', 'learner'] as const;

export function validateClaims(c: JwtClaims): void {
  if (!c.sub || !c.role || !c.subRole) {
    throw new DomainError('Missing required JWT claims');
  }
  if (!ROLES.includes(c.role)) {
    throw new DomainError(`Invalid role: ${c.role}`);
  }
  if (typeof c.subRole !== 'string' || c.subRole.length === 0) {
    throw new DomainError('Invalid subRole');
  }
  if (c.username !== undefined && c.username.length === 0) {
    throw new DomainError('Invalid username');
  }
}

export function assertUserActive(user: User): void {
  if (user.snapshot.status !== 'active') {
    throw new DomainError('User is not active');
  }
}
