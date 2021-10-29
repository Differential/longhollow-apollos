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

  async nonPersonaOrFeaturedContentFeedAlgorithm({ channelIds = [], limit = 40, skip = 0 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = await ContentItem.byContentChannelIds(channelIds)
      .top(limit)
      .skip(skip)
      .get();

    const filteredItems = items
      .filter((item) => item.attributeValues.personas.value === '')
      .filter((item) => item.attributeValues.shownonHomePage.value !== 'True')
      .filter(
        (item) => item.attributeValues.featuredonHomePage.value !== 'True'
      );

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
