'use client';
import React, { Fragment } from 'react';
import { DateTime } from 'luxon';
import { isSupportedLanguage } from '../utils/lang';
import { NOT_APPLICABLE } from '../constants';

export interface TableCellProps {
  cellData: string | null; // PayloadCMS passes the raw value
  fieldKey: 'createdAt' | 'updatedAt'; // may not be strictly needed
  language: string;
}

export const CreatedAtCellClient: React.FC<TableCellProps> = ({ cellData, language }) => {
  const locale = isSupportedLanguage(language) ? language : 'en';

  const fromNow = cellData ? DateTime.fromISO(cellData).setLocale(locale).toRelative() : 'N/A';

  return <Fragment>{fromNow ?? NOT_APPLICABLE}</Fragment>;
};
