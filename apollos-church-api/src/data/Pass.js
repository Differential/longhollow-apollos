import {
  dataSource,
  schema,
  resolver as baseResolver,
} from '@apollosproject/data-connector-passes';

const resolver = {
  ...baseResolver,
  Pass: {
    ...baseResolver.Pass,
    passkitFileUrl: async (_, __, { dataSources }) => {
      // check for this first because the next data call takes a long time
      const authToken = await dataSources.Auth.getAuthToken();
      return `https://rock.longhollow.com/page/1308?rckipid=${authToken}`;
    },
  },
};

export { resolver, dataSource, schema };
