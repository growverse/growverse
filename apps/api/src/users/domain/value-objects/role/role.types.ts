import { ROLE_CATALOG } from './role.catalog.js';

export type Role = keyof typeof ROLE_CATALOG;
export type SubRole = typeof ROLE_CATALOG[Role]['subRoles'][number];
