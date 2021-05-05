import gql from 'graphql-tag';
import moment from 'moment';
import { ContentItem } from '@apollosproject/data-connector-rock';
import { contentItemSchema } from '@apollosproject/data-schema';
import ApollosConfig from '@apollosproject/config';

const schema = gql`
  ${contentItemSchema}

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
    time: String
    forWho: String
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
    showTitleOverImage: Boolean
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

  extend type Query {
    getMinistryContent(ministry: String!): [ContentItem]
  }
`;

class dataSource extends ContentItem.dataSource {
  DEFAULT_SORT = () => [
    { field: 'Priority', direction: 'asc' },
    { field: 'Order', direction: 'asc' },
    { field: 'StartDateTime', direction: 'asc' },
  ];

  attributeIsVideo = ({ key }) =>
    key.toLowerCase().includes('video') || key.toLowerCase().includes('vimeo');

  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if not live, return empty content item
    // TODO: return next future sermon
    if (!isLive) return [null];

    const mostRecentSermon = await this.getSermonFeed().first();
    return [mostRecentSermon];
  };

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

  getByMinistry = async (ministry) => {
    // get the Rock enum value (DefinedValue)
    if (!ministry) {
      return [];
    }
    const { guid } = await this.request('DefinedValues')
      // 117 is the Ministries defined type
      .filter(`DefinedTypeId eq 117 and Value eq '${ministry}'`)
      .first();
    const attributeValues = await this.request('AttributeValues')
      .expand('Attribute')
      .filter(
        // 208 is a Rock Content Item
        `Attribute/Name eq 'Ministry' and Attribute/EntityTypeId eq 208 and Value eq '${guid}'`
      )
      .get();
    const contentIds = attributeValues.map(({ entityId }) => entityId);
    return this.getFromIds(contentIds).get();
  };

  buildDetailsHTML = ({ attributeValues }) => {
    const {
      cost: { value: cost } = {},
      time: { value: time } = {},
      forWho: { value: forWho } = {},
      childcareInfo: { value: childcareInfo } = {},
      locationName: { value: locationName } = {},
      locationAddress: { valueFormatted: locationAddress } = {},
      contactName: { value: contactName } = {},
      contactEmail: { value: contactEmail } = {},
      contactPhone: { value: contactPhone } = {},
    } = attributeValues;
    let html = '';
    if (cost) html = `<strong>Cost:</strong> $${cost}`;
    if (time) html = `${html}<br><strong>Time:</strong> ${time}`;
    if (forWho) html = `${html}<br><strong>For Who:</strong> ${forWho}`;
    if (childcareInfo)
      html = `${html}<br><strong>Childcare:</strong> ${childcareInfo}`;
    if (contactName)
      html = `${html}<br><strong>Contact:</strong><br>${contactName}${
        contactPhone ? `<br>${contactPhone}` : ''
      }${contactEmail ? `<br>${contactEmail}` : ''}`;
    if (locationAddress)
      html = `${html}<br><strong>Location:</strong>${
        locationName ? `<br>${locationName}` : ''
      }<br>${locationAddress}`;
    if (html !== '') html = `${html}<br><br>`;
    return html;
  };

  buildFooterHTML = async ({ attributeValues }) => {
    const { Matrix } = this.context.dataSources;
    const { relatedLinks: { value: relatedLinksGuid } = {} } = attributeValues;
    const links = await Matrix.getItemsFromGuid(relatedLinksGuid);
    if (!links.length) return '';
    const linksHTML = links
      .filter(({ attributeValues: { link } }) => link?.value)
      .map(
        ({
          attributeValues: {
            name1,
            link: { value: link },
          },
        }) => `<a href="${link}">${name1?.value || link}</a>`
      )
      .join('<br>');
    return `<br><br><strong>Related Links:</strong><br>${linksHTML}`;
  };

  // same as core, with a longer expiresAt
  async getCoverImage(root) {
    const { Cache } = this.context.dataSources;
    const cachedValue = await Cache.get({
      key: `contentItem:coverImage:${root.id}`,
    });

    if (cachedValue) {
      return cachedValue;
    }

    let image = null;

    // filter images w/o URLs
    const ourImages = this.getImages(root).filter(
      ({ sources }) => sources.length
    );

    if (ourImages.length) {
      image = this.pickBestImage({ images: ourImages });
    }

    // If no image, check parent for image:
    if (!image) {
      // The cursor returns a promise which returns a promisee, hence th edouble eawait.
      const parentItems = await (await this.getCursorByChildContentItemId(
        root.id
      )).get();

      if (parentItems.length) {
        const validParentImages = parentItems
          .flatMap(this.getImages)
          .filter(({ sources }) => sources.length);

        if (validParentImages && validParentImages.length)
          image = this.pickBestImage({ images: validParentImages });
      }
    }

    if (image != null) {
      Cache.set({
        key: `contentItem:coverImage:${root.id}`,
        data: image,
        expiresIn: 60 * 5,
      });
    }

    return image;
  }
}

const resolver = {
  ...ContentItem.resolver,
  Query: {
    getMinistryContent: (_, { ministry }, { dataSources }) =>
      dataSources.ContentItem.getByMinistry(ministry),
  },
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
  MediaContentItem: {
    ...ContentItem.resolver.MediaContentItem,
    htmlContent: async (item, _, { dataSources }) =>
      `${dataSources.ContentItem.buildDetailsHTML(
        item
      )}${dataSources.ContentItem.createHTMLContent(
        item.content
      )}${await dataSources.ContentItem.buildFooterHTML(item)}`,
  },
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    htmlContent: async (item, _, { dataSources }) =>
      `${dataSources.ContentItem.buildDetailsHTML(
        item
      )}${dataSources.ContentItem.createHTMLContent(
        item.content
      )}${await dataSources.ContentItem.buildFooterHTML(item)}`,
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
    linkURL: ({ attributeValues: { linkUrl } }) => linkUrl?.value,
    ctaLinks: (
      { attributeValues: { ctaLinks } },
      args,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(ctaLinks?.value),
    location: ({ attributeValues: { locationName, locationAddress } }) => ({
      name: locationName?.value,
      address: locationAddress?.valueFormatted,
    }),
    time: ({ attributeValues: { time } }) => time?.value,
    forWho: ({ attributeValues: { forWho } }) => forWho?.value,
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
    showTitleOverImage: ({ attributeValues: { showTitleOverImage } }) =>
      showTitleOverImage?.value !== 'False',
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
  RelatedLink: {
    name: ({ attributeValues: { name1 } }) => name1?.value,
    uri: ({ attributeValues: { link } }) => link?.value,
  },
};

export { resolver, schema, dataSource };
