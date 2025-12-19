import { FeatureFeed } from '#apollos/data-connector-rock/index.js';

const { resolver: coreResolver, dataSource } = FeatureFeed;

const resolver = {
  ...coreResolver,
  Query: {
    ...coreResolver.Query,
    watchFeedFeatures: (root, args, { dataSources }) =>
      dataSources.FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'WATCH_FEATURES', ...args },
      }),
    prayFeedFeatures: (root, args, { dataSources }) =>
      dataSources.FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'PRAY_FEATURES', ...args },
      }),
  },
};
export { dataSource, resolver };
