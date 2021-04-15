import gql from 'graphql-tag';
import moment from 'moment';
import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const schema = gql`
  ${ContentItem.schema}

  extend type WeekendContentItem {
    speaker: String
    topics: [String]
    scriptures: [Scripture]
  }

  extend type UniversalContentItem {
    isFeatured: Boolean
    isMembershipRequired: Boolean
    isGroupEvent: Boolean
    subtitle: String
    ministry: String
    campus: Campus
    contactName: String
    contactEmail: String
    contactPhone: String
    tripType: String
    daysAvailable: [String]
    serviceArea: [String]
    opportunityType: [String]
    relatedSkills: [String]
    location: Location
    start: String
    end: String
    relatedLinks: [RelatedLink]
    linkText: String
    linkURL: String
    ctaLinks: [CTA]
    childcareInfo: String
    deadline: String
    finePrint: String
    closedInstructions: String
    schedule: String
    socialMedia: SocialMediaInfo
  }

  type SocialMediaInfo {
    title: String
    summary: String
    image: ImageMedia
  }

  type RelatedLink {
    name: String
    uri: String
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
  attributeIsVideo = ({ key }) =>
    key.toLowerCase().includes('video') || key.toLowerCase().includes('vimeo');

  getFeatures = async (item) => {
    const features = await super.getFeatures(item);

    const { Feature, Matrix } = this.context.dataSources;
    const scriptures = await Matrix.getItemsFromGuid(
      item.attributeValues.memoryVerses?.value
    );
    if (scriptures !== []) {
      scriptures.forEach(({ attributeValues }, i) => {
        features.push(
          Feature.createScriptureFeature({
            reference: attributeValues.passage.value,
            id: `${item.attributeValues.memoryVerses.id}-${i}`,
          })
        );
      });
    }

    return features;
  };
}

const resolver = {
  ...ContentItem.resolver,
  DevotionalContentItem: {
    ...ContentItem.resolver.DevotionalContentItem,
    scriptures: async ({ attributeValues }, args, { dataSources }) => {
      const scriptures = await dataSources.Matrix.getItemsFromGuid(
        attributeValues.scriptures?.value
      );
      const query = scriptures
        .map((scripture) => scripture.attributeValues.passage.value)
        .join(', ');
      return query ? dataSources.Scripture.getScriptures(query) : [];
    },
  },

  WeekendContentItem: {
    ...ContentItem.resolver.WeekendContentItem,
    topics: ({ attributeValues: { topics } }) =>
      topics?.valueFormatted
        ? topics?.valueFormatted.split(',').map((topic) => topic.trim())
        : [],
    scriptures: (
      { attributeValues: { scriptures } },
      args,
      { dataSources: { Scripture } }
    ) => Scripture.getScriptures(scriptures?.value || ''),
    speaker: ({ attributeValues: { speaker } }) => speaker?.value,
  },
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    isFeatured: ({ attributeValues: { isFeatured } }) =>
      isFeatured?.value === 'True',
    isMembershipRequired: ({ attributeValues: { isMembershipRequired } }) =>
      isMembershipRequired?.value === 'True',
    isGroupEvent: ({ attributeValues: { groupEvent } }) =>
      groupEvent?.value === 'True',
    subtitle: ({ attributeValues: { subtitle } }) => subtitle?.value,
    ministry: ({ attributeValues: { ministry } }) => ministry?.valueFormatted,
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
    daysAvailable: ({ attributeValues: { daysAvailable } }) =>
      daysAvailable?.valueFormatted
        ? daysAvailable?.valueFormatted.split(',').map((day) => day.trim())
        : [],
    serviceArea: ({ attributeValues: { serviceArea } }) =>
      serviceArea?.valueFormatted
        ? serviceArea?.valueFormatted.split(',').map((area) => area.trim())
        : [],
    opportunityType: ({ attributeValues: { opportunityType } }) =>
      opportunityType?.valueFormatted
        ? opportunityType?.valueFormatted.split(',').map((type) => type.trim())
        : [],
    relatedSkills: ({ attributeValues: { relatedSkills } }) =>
      relatedSkills?.valueFormatted
        ? relatedSkills?.valueFormatted.split(',').map((skill) => skill.trim())
        : [],
    relatedLinks: (
      { attributeValues: { relatedLinks } },
      __,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(relatedLinks?.value),
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
    schedule: ({ attributeValues: { schedule } }) => schedule?.value,
    contactName: ({ attributeValues: { contactName } }) => contactName?.value,
    contactEmail: ({ attributeValues: { contactEmail } }) =>
      contactEmail?.value,
    contactPhone: ({ attributeValues: { contactPhone } }) =>
      contactPhone?.value,
    socialMedia: ({
      attributeValues: {
        socialMediaTitle,
        socialMediaSummary,
        socialMediaGraphic,
      },
    }) => ({
      title: socialMediaTitle?.value,
      summary: socialMediaSummary?.value,
      image: {
        __typename: 'ImageMedia',
        key: socialMediaGraphic?.attributeId,
        name: socialMediaGraphic?.value,
        sources: socialMediaGraphic?.value
          ? [
              {
                uri: `${ApollosConfig.ROCK.IMAGE_URL}?guid=${
                  socialMediaGraphic?.value
                }`,
              },
            ]
          : [],
      },
    }),
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
