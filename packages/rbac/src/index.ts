import { Access, CollectionConfig, Config, GlobalConfig } from 'payload';
import { hasAccessToAction } from './utils/hasAccessToAction.js';
import { populateOptions } from './utils/populateFieldOptions.js';
import { AuthorizationPluginConfig } from './types/index.js';
import { mergeAccessControl } from './utils/mergeAccessControls.js';

export const roleBasedAccessControlPlugin =
  (pluginConfig: AuthorizationPluginConfig) =>
  (incomingConfig: Config): Config => {
    if (!incomingConfig || !incomingConfig.collections) {
      throw new Error('Invalid incoming configuration or collections are missing');
    }
    const entities: { label: string; value: string }[] = [];

    const createAccess = (slugName: string, labelName?: string) => {
      const baseAccess: { read: Access; update: Access } = {
        read: hasAccessToAction(slugName, 'read', pluginConfig),
        update: hasAccessToAction(slugName, 'update', pluginConfig),
      };
      const label = labelName ? labelName : slugName.charAt(0).toUpperCase() + slugName.slice(1);
      entities.push({ label, value: slugName });
      return baseAccess;
    };
    const createAccessCollection = (slugName: string, labelName?: string) => {
      const baseAccess: { read: Access; update: Access; create?: Access; delete?: Access } =
        createAccess(slugName, labelName);
      const access = {
        ...baseAccess,
        create: hasAccessToAction(slugName, 'create', pluginConfig),
        delete: hasAccessToAction(slugName, 'delete', pluginConfig),
      };
      return access;
    };

    const config: Config = {
      ...incomingConfig,
      collections: incomingConfig.collections?.map((collection) => {
        const shouldApplyPlugin = pluginConfig.includedCollections
          ? pluginConfig.includedCollections.includes(collection.slug)
          : pluginConfig.excludedCollections
            ? !pluginConfig.excludedCollections.includes(collection.slug)
            : true;

        if (!shouldApplyPlugin) {
          return collection;
        }

        const pluginAccess = collection.labels
          ? createAccessCollection(
              collection.slug,
              String(collection.labels.plural ? collection.labels.plural : collection.labels),
            )
          : createAccessCollection(collection.slug);

        return {
          ...collection,
          access: mergeAccessControl(collection.access, pluginAccess),
        };
      }) as CollectionConfig[],
      globals: incomingConfig.globals?.map((global) => {
        const pluginAccess = global.label
          ? createAccess(global.slug, String(global.label))
          : createAccess(global.slug);

        return {
          ...global,
          access: mergeAccessControl(global.access, pluginAccess),
        };
      }) as GlobalConfig[],
    };

    config.collections?.forEach((collection) => {
      if (collection.slug == 'roles') {
        populateOptions(collection.fields, entities);
      }
    });

    return config;
  };
