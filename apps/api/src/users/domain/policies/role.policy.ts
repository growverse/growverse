import { ROLE_CATALOG, Role, SubRole } from '../value-objects/role/role.catalog.js';
import { DomainError } from '../errors/domain.error.js';

export function isValidSubRole(role: Role, subRole: SubRole): boolean {
  const catalog = ROLE_CATALOG[role];
  return (catalog.subRoles as readonly string[]).includes(subRole as string);
}

export function assertValidRolePair(role: Role, subRole: SubRole): void {
  if (!ROLE_CATALOG[role]) {
    throw new DomainError(`Unknown role: ${role}`);
  }
  if (!isValidSubRole(role, subRole)) {
    throw new DomainError(`Invalid subRole "${subRole}" for role "${role}"`);
  }
}
