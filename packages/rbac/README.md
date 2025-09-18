## [RBAC Plugin](./src/index.ts)

**This plugin enables you to define roles** based on **granular permissions per collection**.  
✨ **Roles are assigned to users** to **control access** and manage permissions efficiently. 🚀

### Usage

With this plugin, you're in full control of user roles and permissions in **Payload CMS**. While there is a built-in **Administrator** role, you can go beyond that and **create custom roles** tailored to your needs.

Define roles with **any combination of permissions**—**create, read, update, delete, publish**—and apply them to **any collection or global** within your project.

### How It Works

Each role you create consists of:  
✅ **Granular Permissions:** Assign **create, read, update, delete, publish** permissions to collections and globals.  
✅ **Advanced Access Queries:** Define **Where** queries for your read, update or delete permissions.
✅ **Hierarchical Access:**

With this powerful system, you have complete flexibility in managing access control—ensuring the right people have the right level of control.

Administrators can set as many permissions he/she wants within a role and as many as roles within a user

### Install

Install the plugin using your node package manager, e.g:

`pnpm add @flexiweb/rbac`

### Setup

In the payload.config.ts add the following:

```typescript
plugins: [
  ...plugins,
  roleBasedAccessControlPlugin({
    rolesCollection: 'roles', // name of the collection defining the roles
    permissionsField: 'permissions', // name of the field within the role collection
    // excludedCollections: ['users'], // array of collections names to exclude
  }),
];
```

Install the roles collection (you don't have to use this collection, you can write your own roles).

```javascript
  import { Roles } from '@flexiweb/rbac/collections'
  collections: [...collection, Roles],

```

### Fields Configuration

The `users` collection must be update to include the following fields:

```javascript
import { userFields } from '@flexiweb/rbac/fields';

fields: [...fields, ...userFields];
```

### `isAdmin` Role

When `isAdmin` is **enabled**, the user has **full access** to the system, including:

✅ **ALL permissions** across all collections and globals  
✅ **Manage all content without restrictions**  
✅ **Access admin-only features**

This role ensures complete control over the CMS, allowing seamless content management.
