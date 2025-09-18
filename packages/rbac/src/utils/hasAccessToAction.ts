import { Access, Where, User } from 'payload';
import { canUserAccessAction } from '../access/general.js';
import type { AuthorizationPluginConfig } from '../types/index.js';

export const hasAccessToAction =
  (slugName: string, action: string, pluginConfig: AuthorizationPluginConfig): Access =>
  ({ req: { user, payload } }) => {
    if (user && ('userRoles' in user || 'isAdmin' in user)) {
      const cmuser = user as unknown;
      return canUserAccessAction(cmuser as User, slugName, action, payload, pluginConfig) as
        | boolean
        | Where
        | Promise<boolean | Where>;
    } else {
      return false;
    }
  };
