# RBAC Plugin Usage Examples

This document demonstrates how to use the RBAC plugin, including the `publicReadable` feature and how it respects existing access control.

## Configuration

```typescript
// payload.config.ts
import { roleBasedAccessControlPlugin } from '@flexiweb/rbac';

export default buildConfig({
  // ... other config
  plugins: [
    roleBasedAccessControlPlugin({
      rolesCollection: 'roles',
      permissionsField: 'permissions',
      publicReadable: ['posts', 'pages', 'products'], // These collections can be read by anyone
    }),
  ],
  collections: [
    // ... your collections
  ],
});
```

## How it works

1. **With authentication**: Users with proper roles and permissions can perform all allowed actions (create, read, update, delete, publish) based on their role permissions.

2. **Without authentication**: Users without authentication can only **read** collections listed in `publicReadable`. All other operations are denied.

## Example Scenarios

### Scenario 1: Public Blog

```typescript
// Anyone can read blog posts
publicReadable: ['posts'];

// Result:
// - Anonymous users: Can only read posts
// - Authenticated users: Can perform actions based on their role permissions
```

### Scenario 2: E-commerce Site

```typescript
// Public can browse products and read pages, but need auth for orders
publicReadable: ['products', 'pages'];

// Result:
// - Anonymous users: Can read products and pages
// - Authenticated users: Can manage orders, users, etc. based on permissions
```

### Scenario 3: Mixed Content

```typescript
// Some content is public, some requires authentication
publicReadable: ['articles', 'news', 'faq'];

// Result:
// - Anonymous users: Can read articles, news, and FAQ
// - Authenticated users: Can manage all content based on their role
```

## Working with Existing Access Control

The RBAC plugin respects existing access control definitions. Here's how it works:

### Example: Collection with Custom Read Access

```typescript
// Your collection with existing access control
const posts = {
  slug: 'posts',
  access: {
    read: ({ req: { user } }) => {
      // Custom logic: only published posts for non-admin users
      if (user?.isAdmin) return true;
      return { status: { equals: 'published' } };
    },
    // No create, update, or delete access defined
  },
  fields: [
    // ... your fields
  ],
};

// With the RBAC plugin, the result will be:
// - read: Your custom logic (preserved)
// - create: Plugin's role-based access
// - update: Plugin's role-based access
// - delete: Plugin's role-based access
```

### Example: Global with Partial Access Control

```typescript
// Your global with some access control
const settings = {
  slug: 'settings',
  access: {
    read: () => true, // Public read access
    update: ({ req: { user } }) => user?.isAdmin, // Only admins can update
    // No create or delete access defined
  },
  fields: [
    // ... your fields
  ],
};

// With the RBAC plugin, the result will be:
// - read: Your custom logic (preserved)
// - update: Your custom logic (preserved)
// - create: Plugin's role-based access (if create is defined in roles)
// - delete: Plugin's role-based access (if delete is defined in roles)
```

### Benefits

- **No conflicts** - Your existing access control logic remains intact
- **Gradual adoption** - You can add the plugin to existing projects without breaking changes
- **Flexible** - Mix custom access control with role-based permissions as needed
- **Safe** - The plugin never overrides your existing access control

## Role Collection Security Features

The roles collection includes built-in security features:

### Read Access Control

```typescript
// Users can only read their own assigned roles
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
};
```

### Hidden Collection Logic

```typescript
// Roles collection is hidden from non-admin users
admin: {
  hidden: (ctx) => {
    return !Boolean(ctx.user.isAdmin);
  },
}
```

### Field-Level Access Control

```typescript
// Permissions field is only accessible to admins
access: {
  read: isAdminFieldLevel,
  create: isAdminFieldLevel,
  update: isAdminFieldLevel,
}
```

### Benefits

- **Security**: Users cannot see or modify roles they don't have
- **User Experience**: Users can still see their own role information
- **Admin Control**: Only administrators can manage roles and permissions
- **Data Protection**: Sensitive permission data is protected from unauthorized access

## Security Notes

- Only **read** operations are allowed for public access
- All other operations (create, update, delete, publish) still require authentication
- The `publicReadable` setting overrides role-based permissions for read access when no user is logged in
- Use this feature carefully - only mark collections as public if the content should be accessible to everyone
- **Existing access control always takes priority** - The plugin will never override your custom access control logic
- **Role collection is automatically secured** - Users can only access their own roles, and the collection is hidden from non-admins
