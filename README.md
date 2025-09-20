## 🚀 Flexiweb - Plugins Collection

This repository contains a set of powerful plugins designed to enhance your [Flexiweb (built on Payload CMS)](https://payloadcms.com/) projects.

Huge thanks for [Shefing](https://github.com/shefing) for creating [this repo](https://github.com/shefing/payload-tools). Flexiweb plugin collection builds on top of Shefing and other open source contributors work.

### 🔌 **Available Plugins** (Compatible with Payload 3.55.1)

1. **[RBAC](packages/rbac/)**
   Control your access rules from the admin panel with ease. Define a role, set up its permissions by setting create, read, update, delete, publish access on collections or globals. It does not end there. With the **Advanced** option you can define Where queries right there too.

2. **[Author Info](packages/author-info/)**  
   Automatically display **author information** in the authoring interface, including details like **createdBy, updaters, publishedBys**, and the **last publish date**.

3. **[Version Info](packages/version-info/)**  
   TBD

4. **[Audit](packages/audit/)**  
   TBD

5. **[Appointments](packages/appointments/)**  
   TBD

6. **[Custom Fields](packages/custom-fields/)**
   TBD

7. **[Web](packages/web/)**
   TBD

8. **[Blocks](packages/blocks/)**
   TBD

9. **[Speed Insigths](packages/speed-insights/)**
   TBD

10. **[Inventory](packages/inventory/)**
    TBD

11. **[Employees](packages/employees/)**
    TBD

12. **[Rich-Text Comments](packages/rich-text-comments/)**
    TBD

13. **[Right Panel](packages/right-panel/)**
    TBD

14. **[Restaurant Manager](packages/restaurant-manager/)**
    TBD

15. **[Core](packages/restaurant-core/)**
    TBD

---

💡 **Tip:** Since plugins are intended mainly to integrate into the Flexiweb domain, not every plugin is modular and can be integrated independently based on your project needs. Check out the linked documentation for installation instructions and configuration details.

---

## 🛠️ Development Notes

### NPM Package Management

#### Publishing Packages to NPM

This repository includes a GitHub Action that allows you to publish any package to NPM:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Publish Package to NPM" workflow
3. Click "Run workflow"
4. Select the package you want to publish from the dropdown
5. Choose the version type (patch, minor, major) to determine how the version number will be incremented
6. Click "Run workflow" to start the publishing process

**Note:** This action requires an NPM access token stored as a GitHub secret named `NPM_TOKEN`.

#### Purging Packages from NPM

For maintenance purposes, you can purge all versions of a package from NPM using the "Purge Package from NPM" workflow:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Purge Package from NPM" workflow
3. Click "Run workflow"
4. Select the package you want to purge from the dropdown
5. Type "PURGE" in the confirmation field (this is required to prevent accidental purges)
6. Leave "Dry run" set to "true" to preview what would be unpublished without actually doing it
7. Click "Run workflow" to start the process

When you're ready to actually purge the package:

1. Follow the same steps, but set "Dry run" to "false"
2. The workflow will unpublish all versions of the package from NPM

**Warning:** Purging packages is irreversible and may affect users who depend on your package. Use with caution.

---
