/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  CreateExceptionListItemSchema,
  EntriesArray,
  ExceptionListItemSchema,
} from '../shared_imports';
import { Type } from './schemas/common/schemas';

export const hasLargeValueItem = (
  exceptionItems: Array<ExceptionListItemSchema | CreateExceptionListItemSchema>
) => {
  return exceptionItems.some((exceptionItem) => hasLargeValueList(exceptionItem.entries));
};

export const hasLargeValueList = (entries: EntriesArray): boolean => {
  const found = entries.filter(({ type }) => type === 'list');
  return found.length > 0;
};

export const hasNestedEntry = (entries: EntriesArray): boolean => {
  const found = entries.filter(({ type }) => type === 'nested');
  return found.length > 0;
};

export const hasEqlSequenceQuery = (ruleQuery: string | undefined): boolean => {
  if (ruleQuery != null) {
    const parsedQuery = ruleQuery.trim().split(/[ \t\r\n]+/);
    return parsedQuery[0] === 'sequence' && parsedQuery[1] !== 'where';
  }
  return false;
};

export const isEqlRule = (ruleType: Type | undefined): boolean => ruleType === 'eql';
export const isThresholdRule = (ruleType: Type | undefined): boolean => ruleType === 'threshold';
export const isQueryRule = (ruleType: Type | undefined): boolean =>
  ruleType === 'query' || ruleType === 'saved_query';
export const isThreatMatchRule = (ruleType: Type | undefined): boolean =>
  ruleType === 'threat_match';
