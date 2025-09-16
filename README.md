## 🚀 Flexiweb - Plugins Collection

This repository contains a set of powerful plugins designed to enhance your [Flexiweb (built on Payload CMS)](https://payloadcms.com/) projects.

Huge thanks for [Shefing](https://github.com/shefing) for creating [this repo](https://github.com/shefing/payload-tools). Flexiweb plugin collection builds on top of Shefing and other open source contributors work.

### 🔌 **Available Plugins** (Compatible with Payload 3.0)

2. **👤 [Author Info](packages/author-info/)**  
   Automatically display **author information** in the authoring interface, including details like **creator, updaters, publishers**, and the **last publish date**.

3. **💬 [Rich-text Comments](packages/comments/)**  
   Enable **inline comments and discussions** directly within the Payload authoring interface. This plugin supports **rich text commenting** using [Lexical](https://lexical.dev/), perfect for content collaboration.

4. **📋 [Right Panel](packages/right-panel/)**  
   Enhance the editing experience with a **custom right-side panel**. This view allows you to manage **related entities** side-by-side, improving productivity when working with complex data relationships.

5. **📝 [Custom Version View](packages/version-info/)**  
   Improve version control with a **custom version view** that displays "**Updated at**" and "**Updated by**" fields. This plugin integrates seamlessly with the [Authors Info](packages/author-info/) plugin.

6. **🔗 [Cross-Collection Config](packages/cross-collection/)**  
   The **Cross-Collection Config Plugin** empowers you to modify the view of components in Payload CMS,
   injecting **custom behaviors** and offering **global configuration capabilities** not natively supported.

7. **⚙️ [Field-type Component Override](packages/field-type-components-override/)**  
   Dynamically override all fields of a specific type in Payload CMS by replacing their default components with **custom ones—seamlessly** and **automatically**. This plugin allows you to define a field type once and apply your custom component globally across your collections.

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
