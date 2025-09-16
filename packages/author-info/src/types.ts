import { Operation, VerstionStatus, supportedLanguages } from './constants.js';

export type IncomingCollectionVersions = {
  drafts?: boolean;
  maxPerDoc?: number;
};

export interface AuthorsInfoPluginConfig {
  /** Array of collection slugs to exclude */
  excludedCollections?: string[];
  /** Array of global slugs to exclude */
  excludedGlobals?: string[];
  /** The name of user name field in Users collection */
  usernameField?: string;
}

export type Operation = (typeof Operation)[keyof typeof Operation];
export type VerstionStatus = (typeof VerstionStatus)[keyof typeof VerstionStatus];
export type SupportedLanguage = (typeof supportedLanguages)[number];
