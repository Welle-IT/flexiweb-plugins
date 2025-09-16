import { PayloadRequest } from 'payload';
import { DEFAULT_AUTHOR_NAME, VerstionStatus } from '../constants';
import { Operation } from '../constants';
interface DataWithUpdatedByField {
  [key: string]: unknown;
  [key: number]: unknown; // Allow numeric keys as well if needed
}
export const setAuthorsData = (
  updatedByFieldName: string,
  createdByFieldName: string,
  publishedByFieldName: string,
  publishedAtFieldName: string,
  usernameField: string,
  noOp: boolean = false,
): ((args: {
  /* eslint-disable */
  [x: string]: any;
  /* eslint-enable */
  data: DataWithUpdatedByField;
  req: PayloadRequest;
  operation?: string;
}) => Promise<DataWithUpdatedByField>) => {
  return async (args) => {
    //For Globals not operation is passed so have it update
    if (!args?.operation) args.operation = Operation.UPDATE;
    if (
      args?.operation === Operation.UPDATE &&
      args.data !== undefined &&
      args.req.user !== undefined
    ) {
      args.data[updatedByFieldName] = args.req.user?.[usernameField] || DEFAULT_AUTHOR_NAME;
    }
    if (
      args?.operation == Operation.CREATE &&
      args.data !== undefined &&
      args.req.user !== undefined
    ) {
      args.data[createdByFieldName] = args.req.user?.[usernameField] || DEFAULT_AUTHOR_NAME;
    }
    if (args?.data !== undefined && args.req.user !== undefined) {
      switch (args?.operation) {
        case Operation.CREATE:
          if (args?.data._status === VerstionStatus.PUBLISHED) {
            args.data[publishedAtFieldName] = new Date();
            args.data[publishedByFieldName] = args.req.user?.[usernameField] || DEFAULT_AUTHOR_NAME;
          }
          break;
        case Operation.UPDATE:
          if (
            args?.originalDoc._status === VerstionStatus.DRAFT &&
            args?.data._status === VerstionStatus.PUBLISHED
          ) {
            args.data[publishedAtFieldName] = new Date();
            args.data[publishedByFieldName] = args.req.user?.[usernameField] || DEFAULT_AUTHOR_NAME;
          }
          break;
      }
    }

    if (noOp) {
      delete args.operation;
    }
    return args.data;
  };
};
