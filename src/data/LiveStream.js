import * as LiveStream from '../apollos/data-connector-church-online/index.js';

const { schema, dataSource } = LiveStream;

// TODO placeholder until the core resolvers are fixed to allow null content items through
const resolver = {
  ...LiveStream.resolver,
  LiveStream: {
    contentItem: ({ contentItem }) => contentItem,
  },
};

export { schema, resolver, dataSource };
