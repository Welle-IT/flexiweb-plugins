import { Access } from 'payload';

// Helper function to merge access control objects, preserving existing access control
export const mergeAccessControl = (
  existingAccess: { read?: Access; update?: Access; create?: Access; delete?: Access } | undefined,
  pluginAccess: { read: Access; update: Access; create?: Access; delete?: Access },
) => {
  if (!existingAccess) {
    return pluginAccess;
  }

  const mergedAccess: { read?: Access; update?: Access; create?: Access; delete?: Access } = {
    ...existingAccess,
  };

  // Only add plugin access control if it doesn't already exist
  if (!existingAccess.read) {
    mergedAccess.read = pluginAccess.read;
  }
  if (!existingAccess.update) {
    mergedAccess.update = pluginAccess.update;
  }
  if (!existingAccess.create && pluginAccess.create) {
    mergedAccess.create = pluginAccess.create;
  }
  if (!existingAccess.delete && pluginAccess.delete) {
    mergedAccess.delete = pluginAccess.delete;
  }

  return mergedAccess;
};
