import { CollectionSlug } from 'payload';

export type AuthorizationPluginConfig = {
  rolesCollection?: string;
  permissionsField?: string;
  excludedCollections?: CollectionSlug[];
  includedCollections?: CollectionSlug[];
};

export type PermissionType = 'create' | 'read' | 'update' | 'delete' | 'publish';

export type GranularPermission = {
  entity: string | string[];
  // Checkbox flags for actions
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  publish?: boolean;
  advanced?: boolean;
  // Optional where filters for each action
  whereRead?: Record<string, unknown>;
  whereUpdate?: Record<string, unknown>;
  whereDelete?: Record<string, unknown>;
  fields?: string[]; // List of allowed fields for this permission
};
