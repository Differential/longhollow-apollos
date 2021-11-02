import { get } from 'lodash';

import { ActionAlgorithm } from '@apollosproject/data-connector-rock';

const { resolver, schema } = ActionAlgorithm;
class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    HOME_TAB_CONTENT_FEED: this.homeTabContentFeedAlgorithm.bind(this),
    NON_PERSONA_OR_FEATURED_CONTENT_FEED: this.nonPersonaOrFeaturedContentFeedAlgorithm.bind(this),
  };

  async homeTabContentFeedAlgorithm({ channelIds = [], limit = 40, skip = 0 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = await ContentItem.byContentChannelIds(channelIds)
      .top(limit)
      .skip(skip)
      .get();

    const featuredItems = items.filter(
      (item) => item.attributeValues.featuredonHomePage.value === 'True'
    );

    const shownOnHomeItems = items.filter(
      (item) => item.attributeValues.shownonHomePage.value === 'True'
    );

    // This returns the featured item first, then the first 2 items marked to be shown on the Home Feed
    const combinedFeaturedAndShownItems = featuredItems.concat(
      shownOnHomeItems.slice(0, 2)
    );

    return combinedFeaturedAndShownItems.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async nonPersonaOrFeaturedContentFeedAlgorithm({ channelIds = [], limit = 10, skip = 0 } = {}) {
    // Attribute IDs
    // Persona  - 13494
    // Shown on Home Page - 12961
    // Featured on Home Page - 12962
    const { ContentItem } = this.context.dataSources;

    // Returns an array of items that do not have a Persona, shownOnHomePage, or featuredOnHomePage
    const combinedArrayByAttribute = await this.request('AttributeValues')
      .filter(
        `
      (((AttributeId eq 13494) and (Value eq '')) or ((AttributeId eq 12961) and (Value eq 'False')) or ((AttributeId eq 12962) and (Value eq 'False')))`
      )
      .cache({ ttl: 60 })
      .get();

    // Returns an array of the EntityIds
    const filteredEntityIds = combinedArrayByAttribute.map(
      (item) => item.entityId
    );

    // Returns the content items based on their EntityIds
    const filteredItems = await ContentItem.getFromIds(filteredEntityIds)
      .top(limit)
      .skip(skip)
      .cache({ ttl: 60 })
      .get();

    return filteredItems.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }
}

export { schema, resolver, dataSource };
