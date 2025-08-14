import { AvatarUser, Role } from '@/domain/roles';

export function displayRole(user: AvatarUser): string {
  switch (user.role) {
    case 'instructor':
      return 'Instructor';
    case 'learner':
      return 'Learner';
    default:
      return 'Bot';
  }
}

const order: Role[] = ['instructor', 'learner', 'bot'];
export function rolePriority(role: Role): number {
  return order.indexOf(role);
}
