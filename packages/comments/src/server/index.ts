import { createServerFeature } from '@payloadcms/richtext-lexical';

export const commentFeature = createServerFeature({
  feature: {
    ClientFeature: '@flexiweb/comments/client#commentClientFeature',
  },
  key: 'comment',
});
