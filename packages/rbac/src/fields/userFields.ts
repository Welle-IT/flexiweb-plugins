import { Field } from 'payload';
import { isAdminFieldLevel } from '../access/isAdmin.js';

export const userFields: Field[] = [
  {
    label: {
      de: 'Admin',
      en: 'Admin',
      hu: 'Adminisztrátor',
    },
    name: 'isAdmin',
    type: 'checkbox',
    defaultValue: false,
    saveToJWT: true,
    access: {
      read: isAdminFieldLevel,
      create: isAdminFieldLevel,
      update: isAdminFieldLevel,
    },
  },
  {
    label: {
      de: 'Rollen',
      en: 'Roles',
      hu: 'Szerepek',
    },
    name: 'userRoles',
    type: 'relationship',
    saveToJWT: true,
    relationTo: 'roles',
    hasMany: true,
    access: {
      create: isAdminFieldLevel,
      update: isAdminFieldLevel,
    },
  },
];
