/* eslint-disable import/prefer-default-export */
/*
Used like this
```
import { ContentItem } from '../../data-connector-rock/index.js'


const resolver = {
  ContentItem: {
    title: () => ...
  }
}

export default resolverMerge(resolver, ContentItem)
```
*/

import util from 'util';

const logError = (...args) => process.stderr.write(`${util.format(...args)}\n`);

export const resolverMerge = (newResolver, { resolver = {} }) => {
  const finalResolver = {};

  // For each of the keys present in both new and old resolvers
  Object.keys({ ...newResolver, ...resolver }).forEach((key) => {
    // Merge in the new resolver, then the old resolver.
    // (We don't want to mutate either, and use Object.assign to make that explicit)
    finalResolver[key] = { ...resolver[key], ...newResolver[key] };
  });
  return finalResolver;
};

export const schemaMerge = () => {
  logError('schemaMerge has been removed. Please use resolverMerge.');
};
