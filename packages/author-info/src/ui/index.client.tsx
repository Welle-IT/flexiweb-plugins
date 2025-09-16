'use client';
import React, { Fragment } from 'react';
import { DateTime } from 'luxon';

export interface TableCellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellData: any;
  fieldKey: 'createdAt' | 'updatedAt';
}

export const CreatedAtCellClient: React.FC<TableCellProps> = (props) => {
  const { cellData, fieldKey } = props;

  const validCellData = cellData?.rowData?.[fieldKey] ?? null;

  const fromNow = validCellData
    ? DateTime.fromISO(validCellData).setLocale('he').toRelative()
    : 'N/A';

  return <Fragment>{fromNow ?? 'N/A'}</Fragment>;
};
