import { gql } from 'apollo-server';

import {
  createApolloServerConfig,
  Interfaces,
} from '../apollos/server-core/index.js';

import * as Analytics from '../apollos/data-connector-analytics/index.js';
import * as Scripture from '../apollos/data-connector-bible/index.js';
// import * as LiveStream from '../apollos/data-connector-church-online/index.js';
// import * as Cloudinary from '../apollos/data-connector-cloudinary/index.js';
import * as OneSignal from '../apollos/data-connector-onesignal/index.js';
// import * as Search from '../apollos/data-connector-algolia-search/index.js';
// import * as Pass from '../apollos/data-connector-passes/index.js';
import * as Cache from '../apollos/data-connector-redis-cache/index.js';
import * as Sms from '../apollos/data-connector-twilio/index.js';
import {
  Followings,
  // Interactions,
  RockConstants,
  // ContentItem,
  ContentChannel,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
  AuthSms,
  Campus,
  Group,
  // Feature,
  // FeatureFeed,
  // ActionAlgorithm,
  Event,
  PrayerRequest,
  Persona,
  // Person
  BinaryFiles,
} from '../apollos/data-connector-rock/index.js';

import * as Theme from './theme/index.js';
import * as ActionAlgorithm from './ActionAlgorithm.js';
import * as Feature from './features/index.js';
import * as FeatureFeed from './feature-feeds/index.js';
import * as Vimeo from './Vimeo.js';
import * as ContentItem from './ContentItem.js';
import * as Person from './Person.js';
import * as Matrix from './Matrix.js';
import * as Search from './Algolia.js';
import * as LiveStream from './LiveStream.js';
import * as Interactions from './interactions/index.js';
import * as Pass from './Pass.js';
import Cloudinary from './Cloudinary.js';

// This module is used to attach Rock User updating to the OneSignal module.
// This module includes a Resolver that overides a resolver defined in `OneSignal`
import * as OneSignalWithRock from './oneSignalWithRock.js';

const data = {
  Interfaces,
  Followings,
  ContentChannel,
  ContentItem,
  Cloudinary,
  Auth,
  AuthSms,
  Sms,
  LiveStream,
  Theme,
  Scripture,
  Interactions,
  RockConstants,
  Sharable,
  Analytics,
  OneSignal,
  PersonalDevice,
  OneSignalWithRock,
  Pass,
  Search,
  Template,
  Campus,
  Group,
  Feature,
  FeatureFeed,
  ActionAlgorithm,
  Event,
  Cache,
  PrayerRequest,
  Vimeo,
  Persona,
  Matrix,
  Person,
  BinaryFiles,
};

const {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
  migrations,
} = createApolloServerConfig(data);

export {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
  migrations,
};

// the upload Scalar is added
export const testSchema = [
  gql`
    scalar Upload
  `,
  ...schema,
];
