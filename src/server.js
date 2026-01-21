import { ApolloServer } from 'apollo-server-express';
import ApollosConfig from './apollos/config/index.js';
import express from 'express';
import { RockRequestMetricsPlugin } from './apollos/rock-apollo-data-source/index.js';
import lodash from 'lodash';
import { setupUniversalLinks } from './apollos/server-core/index.js';
import { BugsnagPlugin } from './apollos/bugsnag/index.js';
import util from 'util';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';

const logError = (...args) => process.stderr.write(`${util.format(...args)}\n`);



const { get } = lodash;

const dataObj = await import('./data/index.js');

const {
  resolvers,
  schema,
  testSchema,
  context,
  dataSources,
  applyServerMiddleware,
  setupJobs,
} = dataObj;

export { resolvers, schema, testSchema };

const isDev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

const enableRockMetrics =
  isDev || process.env.ROCK_REQUEST_METRICS === 'true';
const rockMetricsPlugins = enableRockMetrics ? [RockRequestMetricsPlugin] : [];

const cacheOptions = isDev
  ? {}
  : {
      stripFormattedExtensions: false,
      calculateHttpHeaders: true,
      defaultMaxAge: 3600,
    };

const { ROCK, APP } = ApollosConfig;

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources,
  context,
  introspection: true,
  plugins: [
    new BugsnagPlugin(),
    ApolloServerPluginCacheControl(cacheOptions),
    ...rockMetricsPlugins,
  ],
  formatError: (error) => {
    logError(get(error, 'extensions.exception.stacktrace', []).join('\n'));
    return error;
  },
  playground: {
    settings: {
      'editor.cursorShape': 'line',
    },
  },
  uploads: false,
});

const app = express();

// password reset
app.get('/forgot-password', (req, res) => {
  res.redirect(APP.FORGOT_PASSWORD_URL || `${ROCK.URL}/page/56`);
});

applyServerMiddleware({ app, dataSources, context });
setupJobs({ app, dataSources, context, schema, resolvers });
// Comment out if you don't want the API serving apple-app-site-association or assetlinks manifests.
setupUniversalLinks({ app });

await apolloServer.start();
apolloServer.applyMiddleware({ app });
apolloServer.applyMiddleware({ app, path: '/' });

export default app;
