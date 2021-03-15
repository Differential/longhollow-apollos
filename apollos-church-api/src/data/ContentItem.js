import gql from 'graphql-tag';
import { ContentItem } from '@apollosproject/data-connector-rock';

const schema = gql`
  ${ContentItem.schema}

  extend type UniversalContentItem {
    isFeatured: Boolean
    subtitle: String
  }
`;

class dataSource extends ContentItem.dataSource {
  attributeIsVideo = ({ key }) => key.toLowerCase().includes('vimeo');
}

const resolver = {
  ...ContentItem.resolver,
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    isFeatured: ({ attributeValues }) =>
      attributeValues.isFeatured.value === 'True',
    subtitle: ({ attributeValues }) => attributeValues.subtitle.value,
  },
};

export { resolver, schema, dataSource };
