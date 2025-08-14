import type { Role } from '@/domain/roles';

export function canEnterStage(role: Role): boolean {
  return role === 'instructor'; // future logic
}

export function attachRoleConstraints(_getLocalRole: () => Role) {
  // TODO: integrate with movement/collision code:
  // - If learner and insideStageXZ → block
  // - If instructor, allow on-stage; disallow leaving stage (downwards) if required
}
