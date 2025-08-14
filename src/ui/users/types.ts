import type { AvatarUser, Role } from '@/domain/roles';

export function displayRole(user: AvatarUser): string {
  switch (user.role) {
    case 'instructor':
      return 'Instructor';
    case 'learner':
      return 'Learner';
    case 'bot':
      return 'Bot';
    default: {
      const _exhaustiveCheck: never = user.role;
      return _exhaustiveCheck;
    }
  }
}

const order: Role[] = ['instructor', 'learner', 'bot'];
export function rolePriority(role: Role): number {
  return order.indexOf(role);
}
