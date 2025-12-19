import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gql } from 'apollo-server';

import {
  createApolloServerConfig,
  Interfaces,
} from '#apollos/server-core/index.js';

import * as Analytics from '#apollos/data-connector-analytics/index.js';
import * as Scripture from '#apollos/data-connector-bible/index.js';
import * as LiveStream from '#apollos/data-connector-church-online/index.js';
import * as Cloudinary from '#apollos/data-connector-cloudinary/index.js';
import * as Search from '#apollos/data-connector-algolia-search/index.js';
import * as Pass from '#apollos/data-connector-passes/index.js';
import * as Cache from '#apollos/data-connector-redis-cache/index.js';
import * as Sms from '#apollos/data-connector-twilio/index.js';
import {
  Followings,
  Interactions,
  RockConstants,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
  AuthSms,
  Campus,
  Group,
  BinaryFiles,
  FeatureFeed,
  Event,
  PrayerRequest,
  Person as RockPerson,
  ContentItem as RockContentItem,
  ContentChannel,
  Feature as RockFeature,
  ActionAlgorithm as RockActionAlgorithm,
} from '#apollos/data-connector-rock/index.js';

import {
  Comment,
  UserFlag,
  UserLike,
  Follow,
  Notification,
  NotificationPreference,
  Tag,
  Campus as PostgresCampus,
  Person as PostgresPerson,
  Media as PostgresMedia,
  Feature as PostgresFeature,
  ContentItem as PostgresContentItem,
  ContentItemsConnection,
  ContentItemCategory,
  ActionAlgorithm as PostgresActionAlgorithm,
} from '#apollos/data-connector-postgres/index.js';

import * as Theme from './theme/index.js';

// This modules ties together certain updates so they occurs in both Rock and Postgres.
// Will be eliminated in the future through an enhancement to the Shovel
import {
  Person,
  OneSignal,
  Followings as FollowingsPostgresBridge,
} from './rockWithPostgres.js';

const postgresContentModules = {
  ActionAlgorithm: PostgresActionAlgorithm,
  Feature: PostgresFeature,
  PostgresMedia,
  Tag,
  ContentItem: PostgresContentItem,
  ContentItemsConnection,
  ContentChannel: ContentItemCategory,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rockContentModules = {
  ActionAlgorithm: RockActionAlgorithm,
  Feature: RockFeature,
  ContentItem: RockContentItem,
  ContentChannel,
};

const data = {
  Interfaces,
  Followings,
  FollowingsPostgresBridge, // This entry needs to come after Followings.
  FeatureFeed,
  RockPerson, // This entry needs to come before (postgres) Person
  BinaryFiles, // This entry needs to come before (postgres) Person
  PostgresPerson, // Postgres person for now, as we extend this dataSource in the 'rockWithPostgres' file
  ...(fs.existsSync(path.join(__dirname, '../..', 'config.postgres.yml'))
    ? postgresContentModules
    : rockContentModules),
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
  PersonalDevice,
  Pass,
  Search,
  Template,
  Campus,
  Group,
  Event,
  Cache,
  PrayerRequest,
  Comment,
  UserLike,
  UserFlag,
  Follow,
  PostgresCampus,
  Notification,
  NotificationPreference,
  OneSignal,
  Person, // An extension of Postgres person. Will be eliminated in the near future so you can use just postgres/Person.
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
