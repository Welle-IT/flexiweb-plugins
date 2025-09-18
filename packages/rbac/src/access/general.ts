import { User, Payload, Where } from 'payload';
import { AuthorizationPluginConfig, GranularPermission, PermissionType } from '../types/index.js';

const PERMISSION_HIERARCHY: Record<PermissionType, PermissionType[]> = {
  publish: ['publish', 'read'],
  read: ['read'],
  create: ['create'],
  update: ['update'],
  delete: ['delete'],
};

export const canUserAccessAction = async (
  user: User | null | undefined,
  slugName: string,
  action: string,
  payload: Payload,
  config: AuthorizationPluginConfig,
): Promise<boolean | Where> => {
  if (!user) return false;

  if (user.isAdmin) return true;

  if (!user.userRoles || user.userRoles.length === 0) return false;

  // Normalize role identifiers: accept array of IDs or array of objects with `id`
  const roleIds = (user.userRoles as unknown[])
    .map((roleLike: unknown) => {
      if (typeof roleLike === 'string' || typeof roleLike === 'number') {
        return roleLike;
      }
      if (
        roleLike &&
        typeof roleLike === 'object' &&
        'id' in (roleLike as Record<string, unknown>)
      ) {
        return (roleLike as Record<string, unknown>)['id'] as string | number | undefined;
      }
      return undefined;
    })
    .filter((id): id is string | number => id !== undefined && id !== null);

  if (roleIds.length === 0) return false;

  const roles = await payload.find({
    collection: config.rolesCollection,
    where: {
      id: { in: roleIds },
    },
  });

  if (!roles.docs || roles.docs.length === 0) return false;

  const userAllowedActions = new Set<PermissionType>();
  const whereClauses: Where[] = [];

  const resolvePath = (obj: unknown, path: string): unknown => {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const substituteSelfVars = (input: unknown): unknown => {
    if (typeof input === 'string') {
      if (input === '$self') return user;
      if (input.startsWith('$self.')) {
        const value = resolvePath(user, input.slice('$self.'.length));
        return value as unknown;
      }
      return input;
    }
    if (Array.isArray(input)) {
      return input.map((v) => substituteSelfVars(v));
    }
    if (input && typeof input === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
        out[k] = substituteSelfVars(v);
      }
      return out;
    }
    return input;
  };

  for (const role of roles.docs) {
    const permissions = role[config.permissionsField] as GranularPermission[] | undefined;
    if (!permissions) continue;
    for (const permission of permissions) {
      const entities = Array.isArray(permission.entity)
        ? permission.entity
        : ([permission.entity].filter(Boolean) as string[]);
      if (!entities.includes(slugName)) continue;

      // Checkbox flags and wheres
      const flagMap: Array<{
        flag?: boolean;
        type: PermissionType;
        where?: Where;
        advanced?: boolean;
      }> = [
        { flag: permission.create, type: 'create' },
        {
          flag: permission.read,
          type: 'read',
          where: permission.whereRead as Where | undefined,
          advanced: permission.advanced,
        },
        {
          flag: permission.update,
          type: 'update',
          where: permission.whereUpdate as Where | undefined,
          advanced: permission.advanced,
        },
        {
          flag: permission.delete,
          type: 'delete',
          where: permission.whereDelete as Where | undefined,
          advanced: permission.advanced,
        },
        { flag: permission.publish, type: 'publish' },
      ];

      for (const { flag, type, where, advanced } of flagMap) {
        if (!flag) continue;
        userAllowedActions.add(type);
        PERMISSION_HIERARCHY[type]?.forEach((perm) =>
          userAllowedActions.add(perm as PermissionType),
        );
        if (advanced && where && action === type) {
          const resolved = substituteSelfVars(where) as Where;
          whereClauses.push(resolved);
        }
      }
    }
  }

  if (!userAllowedActions.has(action as PermissionType)) return false;
  if (whereClauses.length === 0) return true;
  return { and: whereClauses };
};
