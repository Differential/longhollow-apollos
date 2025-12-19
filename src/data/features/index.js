import gql from 'graphql-tag';
import { Feature } from '#apollos/data-connector-rock/index.js';

const { dataSource, resolver: baseResolver } = Feature;
const schema = gql`
  ${Feature.schema}

  extend type Query {
    watchFeedFeatures: FeatureFeed @cacheControl(maxAge: 0)
    prayFeedFeatures: FeatureFeed @cacheControl(maxAge: 0)
  }
`;

const resolver = {
  ...baseResolver,
  ScriptureFeature: {
    ...baseResolver.ScriptureFeature,
    title: () => 'Memorize:',
  },
};

export { dataSource, resolver, schema };
