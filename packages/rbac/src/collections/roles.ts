import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminFieldLevel } from '../access/isAdmin.js';

const whereJsonSchema = {
  uri: 'auth://where.json',
  fileMatch: ['auth://where.json'] as string[],
  schema: {
    $id: 'auth://where.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    $defs: {
      Where: {
        type: 'object',
        properties: {
          and: {
            type: 'array',
            items: { $ref: '#/$defs/Where' },
          },
          or: {
            type: 'array',
            items: { $ref: '#/$defs/Where' },
          },
        },
        additionalProperties: {
          anyOf: [
            { type: ['string', 'number', 'boolean', 'null'] },
            {
              type: 'object',
              properties: {
                equals: {},
                not_equals: {},
                in: { type: 'array' },
                nin: { type: 'array' },
                contains: {},
                not_contains: {},
                like: { type: 'string' },
                not_like: { type: 'string' },
                exists: { type: 'boolean' },
                near: { type: 'object' },
                greater_than: {},
                greater_than_equal: {},
                less_than: {},
                less_than_equal: {},
              },
              additionalProperties: false,
            },
          ],
        },
      },
    },
    $ref: '#/$defs/Where',
  },
};

export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: {
    singular: {
      de: 'Rolle',
      en: 'Role',
      hu: 'Szerep',
    },
    plural: {
      de: 'Rollen',
      en: 'Roles',
      hu: 'Szerepek',
    },
  },
  access: {
    create: isAdmin,
    read: async (ctx) => {
      if (!Boolean(ctx.req.user)) return false;
      if (isAdmin(ctx)) return true;
      const roles: [] = ctx.req.user.userRoles || [];
      const roleIds = roles.map((role: { id: number }) => role.id);
      return {
        id: {
          in: roleIds,
        },
      };
    },
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    group: {
      de: 'Admin',
      en: 'Admin',
      hu: 'Adminisztrátor',
    },
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedBy', 'createdBy'],
    hidden: (ctx) => {
      if (!Boolean(ctx.user)) return true;
      return !Boolean(ctx.user.isAdmin);
    },
  },
  fields: [
    {
      name: 'name',
      label: {
        de: 'Rolle Name',
        en: 'Role Name',
        hu: 'Szerepnév',
      },
      type: 'text',
      unique: true,
      localized: true,
    },
    {
      name: 'permissions',
      labels: {
        singular: {
          de: 'Zugriffsberechtigung',
          en: 'Permission',
          hu: 'Engedély',
        },
        plural: {
          de: 'Zugriffsberechtigungen',
          en: 'Permissions',
          hu: 'Engedélyek',
        },
      },
      label: {
        de: 'Zugriffsberechtigungen',
        en: 'Permissions',
        hu: 'Engedélyek',
      },
      saveToJWT: true,
      interfaceName: 'RolePermissions',
      type: 'array',
      validate: (value) => {
        if (!Array.isArray(value)) return true;
        const seen = new Set<string>();
        for (const item of value) {
          const entity =
            typeof (item as unknown as Record<string, unknown>)?.entity === 'string'
              ? ((item as unknown as Record<string, unknown>).entity as string)
              : undefined;
          if (!entity) continue;
          if (seen.has(entity)) {
            return 'Each collection/global can be added only once.';
          }
          seen.add(entity);
        }
        return true;
      },
      access: {
        read: isAdminFieldLevel,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      localized: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'entity',
              label: {
                de: 'Collection oder Global',
                en: 'Collection or Global',
                hu: 'Kollekció vagy globális',
              },
              type: 'select',
              hasMany: false,
              options: [],
              required: true,
              admin: {
                width: '100%',
              },
              localized: true,
            },
            {
              name: 'advanced',
              label: { en: 'Advanced' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
            // Action checkboxes
            {
              name: 'create',
              label: { en: 'Create' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
            {
              name: 'read',
              label: { en: 'Read' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
            {
              name: 'update',
              label: { en: 'Update' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
            {
              name: 'delete',
              label: { en: 'Delete' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
            {
              name: 'publish',
              label: { en: 'Publish' },
              type: 'checkbox',
              admin: { width: '10%' },
              localized: false,
            },
          ],
        },
        {
          name: 'whereRead',
          label: { en: 'Read Where' },
          type: 'json',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.advanced && siblingData?.read),
          },
          jsonSchema: whereJsonSchema,
          localized: false,
        },
        {
          name: 'whereUpdate',
          label: { en: 'Update Where' },
          type: 'json',
          admin: {
            condition: (_data, siblingData) =>
              Boolean(siblingData?.advanced && siblingData?.update),
          },
          jsonSchema: whereJsonSchema,
          localized: false,
        },
        {
          name: 'whereDelete',
          label: { en: 'Delete Where' },
          type: 'json',
          admin: {
            condition: (_data, siblingData) =>
              Boolean(siblingData?.advanced && siblingData?.delete),
          },
          jsonSchema: whereJsonSchema,
          localized: false,
        },
      ],
    },
  ],
};
