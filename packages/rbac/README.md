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
✅ **Public Read Access:** Define collections that are readable by public users (no authentication required).
✅ **Respects Existing Access Control:** If collections or globals already have access control defined, the plugin will only add missing access controls without overriding existing ones.

With this powerful system, you have complete flexibility in managing access control—ensuring the right people have the right level of control.

Administrators can set as many permissions he/she wants within a role and as many as roles within a user

### Access Control Priority

The plugin respects existing access control definitions on collections and globals. This means:

- **Existing access control takes priority** - If a collection or global already has `read`, `update`, `create`, or `delete` access defined, the plugin will not override these
- **Plugin fills gaps** - The plugin only adds access control for operations that don't already have access control defined
- **Flexible integration** - You can use the plugin alongside custom access control logic without conflicts

This behavior ensures that your existing access control logic remains intact while still benefiting from the plugin's role-based permissions where needed.

### Public Read Access

The `publicReadable` configuration option allows you to specify which collections can be read by users who are not logged in. This is useful for:

- **Public content** like blog posts, news articles, or product catalogs
- **Marketing pages** that should be accessible to everyone
- **Public APIs** that don't require authentication

When a collection is marked as `publicReadable`, users without authentication can only **read** the collection data. All other operations (create, update, delete, publish) still require proper authentication and permissions.

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
    // publicReadable: ['posts', 'pages'], // array of collections that are readable by public (no user logged in)
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

### Role Collection Access Control

The roles collection has special access control logic built-in:

#### **Read Access Logic**

- **Admins**: Can read all roles
- **Regular users**: Can only read their own assigned roles
- **Unauthenticated users**: Cannot read any roles

This ensures users can always see their own roles for reference, while maintaining security by preventing access to other users' roles.

#### **Hidden Logic**

- **Admins**: Can see and manage the roles collection in the admin panel
- **Regular users**: The roles collection is completely hidden from the admin interface

This prevents regular users from accessing role management while still allowing them to see their own role information when needed.

#### **Field-Level Access**

- **Permissions field**: Only admins can read, create, or update role permissions
- **Other fields**: Regular users can read basic role information (name, etc.) for their assigned roles

This granular control ensures that sensitive permission data is only accessible to administrators.
