import RockApolloDataSource from '../../rock-apollo-data-source/index.js';
import ApollosConfig from '../../config/index.js';

const { ROCK_MAPPINGS } = ApollosConfig;

export default class ContentChannel extends RockApolloDataSource {
  resource = 'ContentChannels';

  all = () => this.request().expand('ChildContentChannels').get();

  getRootChannels = async () => {
    const ids =
      ROCK_MAPPINGS.ALL_CONTENT_CHANNELS ||
      // TODO deprecated name
      ROCK_MAPPINGS.DISCOVER_CONTENT_CHANNEL_IDS ||
      [];

    if (!ids.length) return [];
    const channels = await this.request()
      .filter(ids.map((channelId) => `(Id eq ${channelId})`).join(' or '))
      .cache({ ttl: 5 })
      .get();

    // sort
    const result = [];
    ids.forEach((configId) => {
      // Remove the matched element from the channel list.
      const channel = channels.splice(
        channels.findIndex(({ id }) => id === configId),
        1
      );
      // And then push it (or nothing) to the end of the result array.
      result.push(...channel);
    });
    // Return results and any left over channels.
    return [...result, ...channels];
  };

  getFromId = async (id) => {
    const { Cache } = this.context.dataSources;
    const cacheKey = `contentChannel:${id}`;
    const cachedValue = await Cache.get({ key: cacheKey });
    if (cachedValue) {
      return cachedValue;
    }

    const channel = await this.request()
      .filter(`Id eq ${id}`)
      .expand('ChildContentChannels')
      .first();

    if (channel) {
      Cache.set({ key: cacheKey, data: channel, expiresIn: 60 * 5 });
    }

    return channel;
  };
}
