import {
  dataSource,
  schema,
  resolver as baseResolver,
} from '../apollos/data-connector-passes/index.js';

const resolver = {
  ...baseResolver,
  Pass: {
    ...baseResolver.Pass,
    passkitFileUrl: () => null,
  },
};

export { resolver, dataSource, schema };
