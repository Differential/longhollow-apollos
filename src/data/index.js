import { gql } from 'apollo-server';

import {
  createApolloServerConfig,
  Interfaces,
} from 'apollos/server-core';

import * as Analytics from 'apollos/data-connector-analytics';
import * as Scripture from 'apollos/data-connector-bible';
// import * as LiveStream from 'apollos/data-connector-church-online';
// import * as Cloudinary from 'apollos/data-connector-cloudinary';
import * as OneSignal from 'apollos/data-connector-onesignal';
// import * as Search from 'apollos/data-connector-algolia-search';
// import * as Pass from 'apollos/data-connector-passes';
import * as Cache from 'apollos/data-connector-redis-cache';
import * as Sms from 'apollos/data-connector-twilio';
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
} from 'apollos/data-connector-rock';

import * as Theme from './theme';
import * as ActionAlgorithm from './ActionAlgorithm';
import * as Feature from './features';
import * as FeatureFeed from './feature-feeds';
import * as Vimeo from './Vimeo';
import * as ContentItem from './ContentItem';
import * as Person from './Person';
import * as Matrix from './Matrix';
import * as Search from './Algolia';
import * as LiveStream from './LiveStream';
import * as Interactions from './interactions';
import * as Pass from './Pass';
import Cloudinary from './Cloudinary';

// This module is used to attach Rock User updating to the OneSignal module.
// This module includes a Resolver that overides a resolver defined in `OneSignal`
import * as OneSignalWithRock from './oneSignalWithRock';

// This is to mock any postgres resolvers so we don't throw API errors for unresolved
// typedefs
import NoPostgres from './noPostgres';

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
  NoPostgres,
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
