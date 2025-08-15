import { assertValidRolePair } from '../policies/role.policy.js';
import { DEFAULT_PREFERENCES, UserPreferences } from '../value-objects/preferences/preferences.types.js';
import { validatePreferences } from '../value-objects/preferences/preferences.policy.js';
import { Role, SubRole } from '../value-objects/role/role.catalog.js';

export type UserStatus = 'active' | 'inactive' | 'banned';

interface UserProps {
  email: string;
  username: string;
  passwordHash: string;
  displayName?: string;
  avatarUrl?: string;
  role: Role;
  subRole: SubRole;
  status?: UserStatus;
  preferences?: Partial<UserPreferences>;
}

export class User {
  private constructor(private props: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    displayName?: string;
    avatarUrl?: string;
    role: Role;
    subRole: SubRole;
    status: UserStatus;
    preferences: UserPreferences;
  }) {}

  static create(id: string, props: UserProps): User {
    const preferences: UserPreferences = { ...DEFAULT_PREFERENCES, ...props.preferences };
    validatePreferences(preferences);
    assertValidRolePair(props.role, props.subRole);
    return new User({
      id,
      email: props.email,
      username: props.username,
      passwordHash: props.passwordHash,
      displayName: props.displayName,
      avatarUrl: props.avatarUrl,
      role: props.role,
      subRole: props.subRole,
      status: props.status ?? 'active',
      preferences,
    });
  }

  get snapshot() {
    return { ...this.props };
  }

  changeRole(role: Role, subRole: SubRole) {
    assertValidRolePair(role, subRole);
    this.props.role = role;
    this.props.subRole = subRole;
  }

  updatePreferences(patch: Partial<UserPreferences>) {
    const prefs = { ...this.props.preferences, ...patch };
    validatePreferences(prefs);
    this.props.preferences = prefs;
  }
}
