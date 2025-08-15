import { ROLE_CATALOG } from './role.catalog.js';

describe('RoleCatalog', () => {
  it('should contain learner role with correct sub-roles', () => {
    expect(ROLE_CATALOG.learner).toBeDefined();
    expect(ROLE_CATALOG.learner.subRoles).toContain('basic');
    expect(ROLE_CATALOG.learner.subRoles).toContain('pro');
    expect(ROLE_CATALOG.learner.subRoles).toContain('vip');
    expect(ROLE_CATALOG.learner.subRoles).toContain('bot');
  });

  it('should contain instructor role with correct sub-roles', () => {
    expect(ROLE_CATALOG.instructor).toBeDefined();
    expect(ROLE_CATALOG.instructor.subRoles).toContain('instructor');
    expect(ROLE_CATALOG.instructor.subRoles).toContain('co-instructor');
    expect(ROLE_CATALOG.instructor.subRoles).toContain('learning-assistant');
  });

  it('should contain admin role with correct sub-roles', () => {
    expect(ROLE_CATALOG.admin).toBeDefined();
    expect(ROLE_CATALOG.admin.subRoles).toContain('global');
    expect(ROLE_CATALOG.admin.subRoles).toContain('local');
  });

  it('should have all expected roles', () => {
    const roles = Object.keys(ROLE_CATALOG);
    expect(roles).toContain('learner');
    expect(roles).toContain('instructor');
    expect(roles).toContain('admin');
    expect(roles).toHaveLength(3);
  });
});
