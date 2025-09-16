import { CollectionConfig, Config, FieldAffectingData, GlobalConfig } from 'payload';
import { Field, UnnamedTab } from 'payload';
import { setAuthorsData } from './hooks/setAuthorsData.js';
import { AuthorsInfoPluginConfig, IncomingCollectionVersions } from './types.js';

const defaultConfig: Required<AuthorsInfoPluginConfig> = {
  excludedCollections: [],
  excludedGlobals: [],
  usernameField: 'name',
};
export const authorInfoPlugin =
  (pluginConfig: AuthorsInfoPluginConfig = {}) =>
  (config: Config): Config => {
    const mergedConfig: Required<AuthorsInfoPluginConfig> = { ...defaultConfig, ...pluginConfig };
    const usersSlug = config.admin?.user;
    if (usersSlug === undefined) {
      throw new Error('[addAuthorsFields] admin.user field is undefined');
    }
    if (config.collections !== undefined) {
      config.collections
        .filter((x) => !mergedConfig.excludedCollections.includes(x.slug))
        .forEach((currentCollection) => {
          const fields: Field[] = (currentCollection as CollectionConfig).fields;
          currentCollection.fields = processFields(
            fields,
            ((currentCollection as CollectionConfig)?.versions as IncomingCollectionVersions)
              ?.drafts as boolean,
          );
          currentCollection.hooks = {
            ...currentCollection.hooks,
            beforeChange: [
              ...((currentCollection.hooks && currentCollection.hooks.beforeChange) || []),
              setAuthorsData(
                'updator',
                'creator',
                'publisher',
                'publishDate',
                mergedConfig.usernameField,
              ),
            ],
          };
        });
    }
    if (config.globals !== undefined) {
      config.globals
        .filter((globalConfig) => !mergedConfig.excludedGlobals.includes(globalConfig.slug))
        .forEach((globalConfig) => {
          globalConfig.hooks = {
            ...globalConfig.hooks,
            beforeChange: [
              ...((globalConfig.hooks && globalConfig.hooks.beforeChange) || []),
              setAuthorsData(
                'updator',
                'creator',
                'publisher',
                'publishDate',
                mergedConfig.usernameField,
                true,
              ),
            ],
          };

          globalConfig.fields = processFields(
            globalConfig.fields,
            ((globalConfig as GlobalConfig)?.versions as IncomingCollectionVersions)
              ?.drafts as boolean,
          );
        });
    }
    return config;
  };
const processFields = (fields: Field[], hasDraft: boolean): Field[] => {
  if (fields.filter((field) => 'name' in field && field.name == 'createdAt').length == 0) {
    fields.push({
      name: 'createdAt',
      type: 'date',
      admin: {
        disableBulkEdit: true,
        hidden: true,
        components: {
          Cell: '@flexiweb/author-info/client#CreatedAtCell',
        },
      },
      // The default sort for list view is createdAt. Thus, enabling indexing by default, is a major performance improvement, especially for large or a large amount of collections.
      index: true,
      label: ({ t }) => t('general:createdAt'),
    });
  }
  if (fields.filter((field) => 'name' in field && field?.name == 'updatedAt').length == 0) {
    fields.push({
      name: 'updatedAt',
      type: 'date',
      localized: true,
      admin: {
        disableBulkEdit: true,
        hidden: true,
        components: {
          Cell: '@flexiweb/author-info/client#UpdatedAtCell',
        },
      },
      label: {
        en: 'Updated At',
        de: 'Geändert am',
        hu: 'Frissítve',
      },
    });
  }

  const authorFields: Field[] = [
    {
      name: 'creator',
      label: {
        en: 'Created By',
        de: 'Erstellt von',
        hu: 'Létrehozó',
      },
      type: 'text',
      localized: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'updator',
      label: {
        en: 'Updated By',
        de: 'Geändert von',
        hu: 'Frissítette',
      },
      type: 'text',
      localized: true,
      admin: {
        readOnly: true,
      },
    },
  ];
  if (hasDraft) {
    authorFields.push(
      {
        name: 'publishDate',
        label: {
          en: 'Published Date',
          de: 'Veröffentlicht am',
          hu: 'Közzétéve',
        },
        type: 'date',
        localized: true,
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
            displayFormat: 'yyyy-MM-dd HH:mm:ss',
          },
          components: { Cell: '@flexiweb/author-info/client#CreatedAtCell' },
        },
      },
      {
        name: 'publisher',
        label: {
          en: 'Published By',
          de: 'Veröffentlicht von',
          hu: 'Közzétette',
        },
        localized: true,
        type: 'text',
        admin: {
          readOnly: true,
        },
      },
    );
  }

  const authorTab: UnnamedTab = {
    label: {
      en: 'Author Data',
      de: 'Autordaten',
      hu: 'Szerző adatok',
    },
    fields: authorFields,
  };
  const hiddenFields = fields.filter(
    (field) => (field as FieldAffectingData).admin?.hidden === true,
  );
  if (fields[0].type == 'tabs') {
    fields[0].tabs.push(authorTab);
  } else {
    const contentTab: UnnamedTab = {
      label: {
        en: 'Content',
        de: 'Inhalt',
        hu: 'Tartalom',
      },
      fields: [...fields.filter((field) => (field as FieldAffectingData).admin?.hidden !== true)],
    };
    fields = [
      {
        type: 'tabs',
        tabs: [contentTab, authorTab],
      },
      ...hiddenFields,
    ];
  }
  return fields;
};
