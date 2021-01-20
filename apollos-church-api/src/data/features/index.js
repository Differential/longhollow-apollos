import gql from 'graphql-tag';
import { Feature } from '@apollosproject/data-connector-rock';

const { dataSource, resolver } = Feature;
const schema = gql`
  ${Feature.schema}

  extend type Query {
    watchFeedFeatures: FeatureFeed @cacheControl(maxAge: 0)
    prayFeedFeatures: FeatureFeed @cacheControl(maxAge: 0)
  }
`;

export { dataSource, resolver, schema };
