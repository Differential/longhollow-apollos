import {
  dataSource,
  schema,
  resolver as baseResolver,
} from 'apollos/data-connector-passes';

const resolver = {
  ...baseResolver,
  Pass: {
    ...baseResolver.Pass,
    passkitFileUrl: () => null,
  },
};

export { resolver, dataSource, schema };
