'use client';

import React from 'react';

import { CreatedAtCellClient } from './index.client.jsx';

export const CreatedAtCell = (props) => {
  return <CreatedAtCellClient cellData={props} fieldKey='createdAt' />;
};

export const UpdatedAtCell = (props) => {
  return <CreatedAtCellClient cellData={props} fieldKey='updatedAt' />;
};
