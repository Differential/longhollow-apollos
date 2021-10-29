import { get } from 'lodash';

import { ActionAlgorithm } from '@apollosproject/data-connector-rock';

const { resolver } = ActionAlgorithm;

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    HOME_TAB_CONTENT_FEED: this.homeTabContentFeedAlgorithm.bind(this),
  };

  async homeTabContentFeedAlgorithm({ channelIds = [], limit = 40, skip = 0 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = await ContentItem.byContentChannelIds(channelIds)
      .top(limit)
      .skip(skip)
      .get();
console.log('items: ', items[0])
// filter out by shownon home page here featured on home page
    return items.map((item, i) => ({
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

export { resolver, dataSource };
