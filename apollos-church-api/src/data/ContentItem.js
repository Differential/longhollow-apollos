import gql from 'graphql-tag';
import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const schema = gql`
  ${ContentItem.schema}

  extend type UniversalContentItem {
    isFeatured: Boolean
    subtitle: String
    ministry: Group
    campus: Campus
    ctaLinks: [CTA]
  }

  type CTA {
    title: String
    body: String
    image: ImageMedia
    buttonText: String
    buttonLink: String
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
    ministry: (
      { attributeValues: { ministry } },
      args,
      { dataSources: { Group } }
    ) =>
      ministry?.value
        ? Group.request()
            .filter(`Guid eq guid'${ministry?.value}'`)
            .first()
        : null,
    campus: (
      { attributeValues: { campus } },
      args,
      { dataSources: { Campus } }
    ) =>
      campus?.value
        ? Campus.request()
            .filter(`Guid eq guid'${campus?.value}'`)
            .first()
        : null,
    ctaLinks: (
      { attributeValues: { ctaLinks } },
      args,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(ctaLinks?.value),
  },
  CTA: {
    title: ({ attributeValues: { title } }) => title?.value,
    body: ({ attributeValues: { body } }) => body?.value,
    image: ({ attributeValues: { image } }) => ({
      __typename: 'ImageMedia',
      key: image?.attributeId,
      name: image?.value,
      sources: image?.value
        ? [{ uri: `${ApollosConfig.ROCK.IMAGE_URL}?guid=${image?.value}` }]
        : [],
    }),
    buttonText: ({ attributeValues: { buttonText } }) => buttonText?.value,
    buttonLink: ({ attributeValues: { buttonLink } }) => buttonLink?.value,
  },
};

export { resolver, schema, dataSource };
