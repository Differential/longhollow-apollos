import gql from 'graphql-tag';
import { ContentItem } from '@apollosproject/data-connector-rock';
import { contentItemSchema } from '@apollosproject/data-schema';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import sanitizeHtml from 'sanitize-html';

const schema = gql`
  ${contentItemSchema}

  extend type WeekendContentItem {
    speaker: String
    topics: [String]
    scriptures: [Scripture]
    relatedLinks: [RelatedLink]
    seriesImage: ImageMedia
  }

  extend type MediaContentItem {
    speaker: String
    topics: [String]
    relatedLinks: [RelatedLink]
    seriesImage: ImageMedia
  }

  extend type UniversalContentItem {
    isFeatured: Boolean
    isMembershipRequired: Boolean
    subtitle: String
    ministry: String
    campus: Campus
    contactName: String
    contactEmail: String
    contactPhone: String
    tripType: String
    daysAvailable: [String]
    groupEventType: [String]
    serviceArea: [String]
    opportunityType: [String]
    relatedSkills: [String]
    location: Location
    time: String
    cost: String
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
    dates: String
    socialMedia: SocialMediaInfo
    showTitleOverImage: Boolean
    navImage: ImageMedia
    secondaryHTML: String
    seriesImage: ImageMedia
    showOnHomePage: Boolean
    featureOnHomePage: Boolean
    summaryHTML: String
    redirectURL: String
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
    getContentBySlug(slug: String!): ContentItem
  }
`;

class dataSource extends ContentItem.dataSource {
  DEFAULT_SORT = () => [
    { field: 'Priority', direction: 'asc' },
    { field: 'Order', direction: 'asc' },
    { field: 'StartDateTime', direction: 'asc' },
  ];

  getCursorByParentContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ContentChannelItemId eq ${id}`)
      .cache({ ttl: 60 })
      .get();

    if (!associations || !associations.length) return this.request().empty();

    const cursor = this.getFromIds(
      associations.map(
        ({ childContentChannelItemId }) => childContentChannelItemId
      )
    );

    cursor.transform((results) =>
      // sort by order
      results.sort((a, b) => {
        // only sort by order if these are website child items
        if (a.contentChannelId !== 47) return 0;
        /**
         * Find the Association Order for the given content channel items
         */
        const { order: orderA } = associations.find(
          (item) => item.childContentChannelItemId === a.id
        );
        const { order: orderB } = associations.find(
          (item) => item.childContentChannelItemId === b.id
        );
        return orderA - orderB;
      })
    );

    // Return the cursor.
    return cursor;
  };

  attributeIsVideo = ({ key }) =>
    key.toLowerCase().includes('video') || key.toLowerCase().includes('vimeo');

  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if not live, return empty content item
    // TODO: return next future sermon
    if (!isLive) return [{ attributes: {}, attributeValues: {} }];

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

  async getUpNext({ id }) {
    const { Auth, Interactions, Cache } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return null;
    }

    let childItemsWithApollosIds;
    const cachedValue = await Cache.get({
      key: `contentItem:childItemsForUpNext:${id}`,
    });

    if (cachedValue) {
      childItemsWithApollosIds = JSON.parse(cachedValue);
    } else {
      const childItemsCursor = await this.getCursorByParentContentItemId(id);
      const childItemsOldestFirst = await childItemsCursor
        .orderBy()
        .sort(this.DEFAULT_SORT())
        .get();

      const childItems = childItemsOldestFirst.reverse();
      childItemsWithApollosIds = childItems.map((childItem) => ({
        ...childItem,
        apollosId: createGlobalId(childItem.id, this.resolveType(childItem)),
      }));
      Cache.set({
        key: `contentItem:childItemsForUpNext:${id}`,
        data: JSON.stringify(childItemsWithApollosIds),
        expiresIn: 60 * 60 * 24,
      });
    }

    const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
      {
        nodeIds: childItemsWithApollosIds.map(({ apollosId }) => apollosId),
        actions: ['COMPLETE'],
      }
    );

    const apollosIdsWithInteractions = interactions.map(
      ({ foreignKey }) => foreignKey
    );

    const firstInteractedIndex = childItemsWithApollosIds.findIndex(
      ({ apollosId }) => apollosIdsWithInteractions.includes(apollosId)
    );

    if (firstInteractedIndex === -1) {
      // If you haven't completed anything, return the first (last in reversed array) item;
      return childItemsWithApollosIds[childItemsWithApollosIds.length - 1];
    }
    if (firstInteractedIndex === 0) {
      // If you have completed the last item, return null (no items left to read)
      return null;
    }
    // otherwise, return the item immediately following the item you have already read
    return childItemsWithApollosIds[firstInteractedIndex - 1];
  }

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

  buildFooterHTML = async ({ attributeValues }) => {
    const { Matrix, Scripture } = this.context.dataSources;
    const {
      relatedLinks: { value: relatedLinksGuid } = {},
      scriptures: { value: references } = {},
      speaker: { value: speaker } = {},
      finePrint: { value: finePrint } = {},
      topics: { valueFormatted: topics } = {},
    } = attributeValues;
    let html = '';

    const links = await Matrix.getItemsFromGuid(relatedLinksGuid);
    let scriptures;
    try {
      scriptures = await Scripture.getScriptures(references);
    } catch (e) {
      console.warn(e);
      scriptures = [];
    }
    if (links.length) {
      const linksHTML = links
        .filter(({ attributeValues: { link } }) => link?.value)
        .map(
          ({
            attributeValues: {
              name1,
              link: { value: link },
            },
          }) => `<a class="btn" href="${link}">${name1?.value || link}</a>`
        )
        .join(' ');
      html = `<h4>Related Links:</h4>${linksHTML}`;
    }
    if (scriptures.length) {
      const scripturesHTML = scriptures
        .map(
          ({ reference, bookId }) =>
            `<a href="https://www.bible.com/bible/1713/${bookId}.${reference
              .match(/\d+:\d+-?\d*/)[0]
              .replace(':', '.')}.CSB">${reference}</a>`
        )
        .join(', ');
      html = `${html}<h4>Scripture</h4>${scripturesHTML}`;
    }
    if (speaker) html = `${html}<h4>Speakers</h4>${speaker}`;
    if (topics) html = `${html}<h4>Topics</h4>${topics}`;
    if (finePrint) html = `${html}<br><br><small>${finePrint}</small>`;
    return html;
  };

  async getNavImage(root) {
    let image = null;
    const ourImages = this.getImages(root).filter(
      ({ sources }) => sources.length
    );
    if (ourImages.length) image = this.pickBestImage({ images: ourImages });
    return image;
  }

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

  // same as core, gets just the parent image though.
  async getSeriesImage(root) {
    const { Cache } = this.context.dataSources;
    const cachedValue = await Cache.get({
      key: `contentItem:seriesCoverImage:${root.id}`,
    });

    if (cachedValue) {
      return cachedValue;
    }

    let image = null;

    // The cursor returns a promise which returns a promise, hence the double await.
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

    if (image != null) {
      Cache.set({
        key: `contentItem:seriesCoverImage:${root.id}`,
        data: image,
        expiresIn: 60 * 5,
      });
    }

    return image;
  }

  getBySlug = async (slug) => {
    const contentItemSlug = await this.request('ContentChannelItemSlugs')
      .filter(`Slug eq '${slug}'`)
      .first();
    if (!contentItemSlug) throw new Error(`Slug "${slug}" does not exist.`);

    return this.getFromId(`${contentItemSlug.contentChannelItemId}`);
  };

  getShareUrl = async ({ id }) => {
    const { slug } = await this.request('ContentChannelItemSlugs')
      .filter(`ContentChannelItemId eq ${id}`)
      .first();
    return `${ApollosConfig.APP.UNIVERSAL_LINK_HOST}/app-link/${slug}`;
  };

  // allows everything through
  createHTMLContent = (content) =>
    sanitizeHtml(content || '', {
      allowedTags: false,
      allowedAttributes: false,
      transformTags: {
        img: (tagName, { src }) => ({
          tagName,
          attribs: {
            // adds Rock URL in the case of local image references in the CMS
            src: src.startsWith('http')
              ? src
              : `${ApollosConfig.ROCK.URL || ''}${src}`,
          },
        }),
      },
    });
}

const resolver = {
  ...ContentItem.resolver,
  Query: {
    getMinistryContent: (_, { ministry }, { dataSources }) =>
      dataSources.ContentItem.getByMinistry(ministry),
    getContentBySlug: (_, { slug }, { dataSources }) =>
      dataSources.ContentItem.getBySlug(slug),
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
    htmlContent: async (item, _, { dataSources }) =>
      `${dataSources.ContentItem.createHTMLContent(
        item.content
      )}${await dataSources.ContentItem.buildFooterHTML(item)}`,
    seriesImage: (root, args, { dataSources }) =>
      dataSources.ContentItem.getSeriesImage(root),
    relatedLinks: (
      { attributeValues: { relatedLinks } },
      __,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(relatedLinks?.value),
  },
  MediaContentItem: {
    ...ContentItem.resolver.MediaContentItem,
    htmlContent: async (item, _, { dataSources }) =>
      `${dataSources.ContentItem.createHTMLContent(
        item.content
      )}${await dataSources.ContentItem.buildFooterHTML(item)}`,
    seriesImage: (root, args, { dataSources }) =>
      dataSources.ContentItem.getSeriesImage(root),
    relatedLinks: (
      { attributeValues: { relatedLinks } },
      __,
      { dataSources: { Matrix } }
    ) => Matrix.getItemsFromGuid(relatedLinks?.value),
  },
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    // strip out cover image to only leave the nav image attribute
    navImage: (root, args, { dataSources }) =>
      dataSources.ContentItem.getNavImage({
        ...root,
        attributes: { ...root.attributes, coverImage: {} },
        attributeValues: { ...root.attributeValues, coverImage: {} },
      }),
    // strip out nav image
    coverImage: (root, args, { dataSources }) =>
      dataSources.ContentItem.getCoverImage({
        ...root,
        attributes: { ...root.attributes, navigationImage: {} },
        attributeValues: { ...root.attributeValues, navigationImage: {} },
      }),
    seriesImage: (root, args, { dataSources }) =>
      dataSources.ContentItem.getSeriesImage(root),
    htmlContent: async (item, _, { dataSources }) =>
      `${dataSources.ContentItem.createHTMLContent(
        item.content
      )}${await dataSources.ContentItem.buildFooterHTML(item)}`,
    // core summary let's anything through
    summaryHTML: ({ content, attributeValues }, _, { dataSources }) =>
      dataSources.ContentItem.createSummary({ content, attributeValues }),
    // clean up summary HTML
    summary: ({ content, attributeValues }, _, { dataSources }) =>
      dataSources.ContentItem.createSummary({
        content: attributeValues?.summary?.value || content,
      }),
    secondaryHTML: async (item, _, { dataSources }) =>
      dataSources.ContentItem.createHTMLContent(
        item.attributeValues.secondaryHtml?.value
      ),
    redirectURL: async ({ attributeValues: { redirectUrl } }) =>
      redirectUrl?.value,
    isFeatured: ({ attributeValues: { isFeatured } }) =>
      isFeatured?.value === 'True',
    showOnHomePage: ({ attributeValues: { shownonHomePage } }) =>
      shownonHomePage?.value === 'True',
    featureOnHomePage: ({ attributeValues: { featuredonHomePage } }) =>
      featuredonHomePage?.value === 'True',
    isMembershipRequired: ({ attributeValues: { membershipRequired } }) =>
      membershipRequired?.value === 'True',
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
    groupEventType: ({ attributeValues: { groupEventType } }) =>
      groupEventType?.valueFormatted
        ? groupEventType?.valueFormatted.split(',').map((type) => type.trim())
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
    cost: ({ attributeValues: { cost } }) => cost?.value,
    forWho: ({ attributeValues: { forWho } }) => forWho?.value,
    childcareInfo: ({ attributeValues: { childcareInfo } }) =>
      childcareInfo?.value,
    deadline: ({ attributeValues: { signupDeadline } }) =>
      signupDeadline?.value || null,
    finePrint: ({ attributeValues: { finePrint } }) => finePrint?.value,
    closedInstructions: ({
      attributeValues: { registrationClosedInstructions },
    }) => registrationClosedInstructions?.value,
    schedule: ({ attributeValues: { schedule } }) => schedule?.value,
    dates: ({ attributeValues: { dates } }) => dates?.value || null,
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
