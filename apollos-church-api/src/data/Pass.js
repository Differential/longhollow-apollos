import {
  dataSource,
  schema,
  resolver as baseResolver,
} from '@apollosproject/data-connector-passes';

const resolver = {
  ...baseResolver,
  Pass: {
    ...baseResolver.Pass,
    passkitFileUrl: () => null,
    description: () => 'Long Hollow',
    backgroundColor: () => 'rgb(113, 214, 113)',
  },
};

export { resolver, dataSource, schema };
