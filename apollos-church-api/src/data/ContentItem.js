import gql from 'graphql-tag';
import { ContentItem } from '@apollosproject/data-connector-rock';

const schema = gql`
  ${ContentItem.schema}

  extend type UniversalContentItem {
    isFeatured: Boolean
    subtitle: String
    staff: Group
  }
`;

class dataSource extends ContentItem.dataSource {
  attributeIsVideo = ({ key }) => key.toLowerCase().includes('vimeo');
}

const resolver = {
  ...ContentItem.resolver,
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    isFeatured: ({ attributeValues: { isFeatured } }) =>
      isFeatured?.value === 'True',
    subtitle: ({ attributeValues: { subtitle } }) => subtitle?.value,
    staff: ({ attributeValues: { staff } }, args, { dataSources: { Group } }) =>
      staff?.value ??
      Group.request()
        .filter(`Guid eq guid'${staff?.value}'`)
        .first(),
  },
};

export { resolver, schema, dataSource };
