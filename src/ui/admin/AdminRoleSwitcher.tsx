import { useState, useEffect } from 'react';
import type { Role, SubRole } from '@/domain/roles';
import { RoleSubRolesMap } from '@/domain/roles';
import { useLocalUser, updateLocalRole } from '@/state/userStore';
import { requestTeleportToRole } from '@/world/spawn';

export function AdminRoleSwitcher(): JSX.Element {
  const local = useLocalUser();
  const [role, setRole] = useState<Role>(local?.role ?? 'learner');
  const [subRole, setSubRole] = useState<SubRole>(
    (local?.subRole as SubRole) ?? RoleSubRolesMap[role][0],
  );

  useEffect(() => {
    const subs = RoleSubRolesMap[role];
    if (!subs.includes(subRole)) setSubRole(subs[0]);
  }, [role, subRole]);

  const apply = () => {
    updateLocalRole(role, subRole);
    requestTeleportToRole(role);
  };

  return (
    <div className="admin-role-switcher">
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
        </select>
      </label>
      <label>
        SubRole:
        <select value={subRole} onChange={(e) => setSubRole(e.target.value as SubRole)}>
          {RoleSubRolesMap[role].map((sr) => (
            <option key={sr} value={sr}>
              {sr}
            </option>
          ))}
        </select>
      </label>
      <button onClick={apply}>Apply</button>
    </div>
  );
}
