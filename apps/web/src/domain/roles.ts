export type Role = 'instructor' | 'learner' | 'bot';

export type InstructorSubRole = 'instructor' | 'co_instructor' | 'learning_assistant';
export type LearnerSubRole = 'vip' | 'pro' | 'basic';
export type SubRole = InstructorSubRole | LearnerSubRole;

export interface AvatarUser {
  id: string;
  name: string;
  role: Role;
  subRole?: SubRole;
  isLocal?: boolean;
  isBot?: boolean;
  color?: string;
  isAdmin?: boolean;
}

export const RoleLabels: Record<Role, { label: string; color: string }> = {
  instructor: { label: 'Instructor', color: '#3b82f6' },
  learner: { label: 'Learner', color: '#22c55e' },
  bot: { label: 'Bot', color: '#6b7280' },
};

export const RoleCapabilities: Record<Role, string[]> = {
  instructor: [],
  learner: [],
  bot: [],
};

export const RoleSubRolesMap: Record<Role, SubRole[]> = {
  instructor: ['instructor', 'co_instructor', 'learning_assistant'],
  learner: ['vip', 'pro', 'basic'],
  bot: [],
};
