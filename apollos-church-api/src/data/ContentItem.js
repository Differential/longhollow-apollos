import gql from 'graphql-tag';
import moment from 'moment';
import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const schema = gql`
  ${ContentItem.schema}

  extend type UniversalContentItem {
    isFeatured: Boolean
    subtitle: String
    ministry: Group
    campus: Campus
    tripType: String
    location: Location
    start: String
    end: String
    alternateLink: String
    linkText: String
    linkURL: String
    ctaLinks: [CTA]
    childcareInfo: String
    deadline: String
    finePrint: String
    closedInstructions: String
  }

  type CTA {
    title: String
    body: String
    image: ImageMedia
    buttonText: String
    buttonLink: String
  }

  type Location {
    name: String
    address: String
    latitude: Float
    longitude: Float
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
    tripType: ({ attributeValues: { tripType } }) => tripType?.valueFormatted,
    alternateLink: ({ attributeValues: { alternateLink } }) =>
      alternateLink?.value,
    linkText: ({ attributeValues: { linkText } }) => linkText?.value,
    linkURL: ({ attributeValues: { linkURL } }) => linkURL?.value,
    ctaLinks: (
      { attributeValues: { ctaLinks } },
      args,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(ctaLinks?.value),
    location: ({ attributeValues: { locationName, locationAddress } }) => ({
      name: locationName?.value,
      address: locationAddress?.valueFormatted,
    }),
    start: ({ attributeValues: { start } }) =>
      start?.value
        ? moment.tz(start?.value, ApollosConfig.ROCK.TIMEZONE).format()
        : null,
    end: ({ attributeValues: { end } }) =>
      end?.value
        ? moment.tz(end?.value, ApollosConfig.ROCK.TIMEZONE).format()
        : null,
    childcareInfo: ({ attributeValues: { childcareInfo } }) =>
      childcareInfo?.value,
    deadline: ({ attributeValues: { signupDeadline } }) =>
      signupDeadline?.value
        ? moment.tz(signupDeadline?.value, ApollosConfig.ROCK.TIMEZONE).format()
        : null,
    finePrint: ({ attributeValues: { finePrint } }) => finePrint?.value,
    closedInstructions: ({
      attributeValues: { registrationClosedInstructions },
    }) => registrationClosedInstructions?.value,
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
