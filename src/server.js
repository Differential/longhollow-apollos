import { ApolloServer } from 'apollo-server-express';
import ApollosConfig from './apollos/config/index.js';
import express from 'express';
import { RockLoggingExtension } from './apollos/rock-apollo-data-source/index.js';
import lodash from 'lodash';
import { setupUniversalLinks } from './apollos/server-core/index.js';
import { BugsnagPlugin } from './apollos/bugsnag/index.js';
import util from 'util';
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

const extensions = isDev ? [() => new RockLoggingExtension()] : [];

const cacheOptions = isDev
  ? {}
  : {
      cacheControl: {
        stripFormattedExtensions: false,
        calculateHttpHeaders: true,
        defaultMaxAge: 3600,
      },
    };

const { ROCK, APP } = ApollosConfig;

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources,
  context,
  introspection: true,
  extensions,
  plugins: [new BugsnagPlugin()],
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
  ...cacheOptions,
});

const app = express();

// password reset
app.get('/forgot-password', (req, res) => {
  res.redirect(APP.FORGOT_PASSWORD_URL || `${ROCK.URL}/page/56`);
});

applyServerMiddleware({ app, dataSources, context });
setupJobs({ app, dataSources, context });
// Comment out if you don't want the API serving apple-app-site-association or assetlinks manifests.
setupUniversalLinks({ app });

apolloServer.applyMiddleware({ app });
apolloServer.applyMiddleware({ app, path: '/' });

export default app;
