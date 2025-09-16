import React from 'react';

import { CreatedAtCellClient } from './index.client.js';
import { DefaultServerCellComponentProps } from 'payload';

export const CreatedAtCell = (props: DefaultServerCellComponentProps) => {
  return (
    <CreatedAtCellClient
      cellData={props.cellData}
      fieldKey='createdAt'
      language={props.i18n.language}
    />
  );
};

export const UpdatedAtCell = (props: DefaultServerCellComponentProps) => {
  return (
    <CreatedAtCellClient
      cellData={props.cellData}
      fieldKey='updatedAt'
      language={props.i18n.language}
    />
  );
};
