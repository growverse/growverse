export const ROLE_CATALOG = {
  admin: { subRoles: ['global', 'local'] as const },
  instructor: { subRoles: ['instructor', 'co-instructor', 'learning-assistant'] as const },
  learner: { subRoles: ['vip', 'pro', 'basic', 'bot'] as const },
} as const;

export type Role = keyof typeof ROLE_CATALOG;
export type SubRole = typeof ROLE_CATALOG[Role]['subRoles'][number];
