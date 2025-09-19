# Public Read Access Example

This example demonstrates how to use the new `publicReadable` feature in the RBAC plugin.

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

## Security Notes

- Only **read** operations are allowed for public access
- All other operations (create, update, delete, publish) still require authentication
- The `publicReadable` setting overrides role-based permissions for read access when no user is logged in
- Use this feature carefully - only mark collections as public if the content should be accessible to everyone
