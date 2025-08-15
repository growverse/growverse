export const ROLE_CATALOG = {
  admin: { label: 'Admin', subRoles: ['global', 'local'] },
  instructor: {
    label: 'Instructor',
    subRoles: ['instructor', 'co-instructor', 'learning-assistant'],
  },
  learner: { label: 'Learner', subRoles: ['vip', 'pro', 'basic', 'bot'] },
} as const;

export type Role = keyof typeof ROLE_CATALOG;
