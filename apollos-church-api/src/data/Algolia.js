import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';
import Redis from 'ioredis';

const { schema, resolver, dataSource: BaseSearch } = baseSearch;

const CATEGORIES = [
  'Sermons',
  'Events',
  'Articles',
  'Mission Trips',
  'Volunteer Positions',
  'Service Opportunities',
];

export class Search extends BaseSearch {
  constructor() {
    super();
    this.createReplicas();
  }

  createReplicas = async () => {
    await this.index.setSettings({
      replicas: ['title_asc', 'publish_date_desc', 'start_date_asc'],
    });

    // title A-Z
    const titleIndex = this.client.initIndex('title_asc');
    titleIndex.setSettings({
      ranking: ['asc(title)'],
    });

    // published most to least recent
    const publishedIndex = this.client.initIndex('publish_date_desc');
    publishedIndex.setSettings({
      ranking: ['desc(publishDate)'],
    });

    // start soonest to furthest
    const startDateIndex = this.client.initIndex('start_date_asc');
    startDateIndex.setSettings({
      ranking: ['asc(startDateTimestamp)'],
    });
  };

  async mapItemToAlgolia(item) {
    const node = await super.mapItemToAlgolia(item);

    const {
      data: {
        node: {
          parentChannel,
          campus,
          ministry,
          tripType,
          daysAvailable,
          serviceArea,
          opportunityType,
          relatedSkills,
          groupEventType,
          speaker,
          topics,
          scriptures,
          sharing,
          publishDate,
          dates,
        },
      },
    } = await graphql(
      this.context.schema,
      `
      {
        node(id: "${node.id}") {
          id
          __typename
          ... on ContentItem {
            parentChannel { name }
            sharing {
              url
            }
            publishDate
          }
          ... on UniversalContentItem {
            campus { name }
            ministry
            tripType
            daysAvailable
            serviceArea
            opportunityType
            relatedSkills
            groupEventType
            dates
          }
          ... on WeekendContentItem {
            speaker
            topics
            scriptures {
              book
            }
          }
        }
      }
      `,
      {},
      this.context
    );
    return {
      ...node,
      category: CATEGORIES.includes(parentChannel?.name)
        ? parentChannel?.name
        : 'General',
      sharingUrl: sharing?.url,
      location: campus?.name,
      ministry,
      tripType,
      daysAvailable,
      serviceArea,
      opportunityType,
      relatedSkills,
      groupEventType,
      speaker,
      topics,
      bookOfTheBible: scriptures?.map(({ book }) => book),
      publishDate,
      startDateTimestamp: dates?.split(',')[0],
    };
  }
}

const { REDIS_URL } = process.env;

let client;
let subscriber;
let queueOpts;
const tlsOptions = {
  tls: {
    rejectUnauthorized: false,
  },
};

if (REDIS_URL) {
  client = new Redis(REDIS_URL, {
    ...(REDIS_URL.includes('rediss') ? tlsOptions : {}),
  });
  subscriber = new Redis(REDIS_URL, {
    ...(REDIS_URL.includes('rediss') ? tlsOptions : {}),
  });

  // Used to ensure that N+3 redis connections are not created per queue.
  // https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#reusing-redis-connections
  queueOpts = {
    createClient(type) {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return new Redis(REDIS_URL);
      }
    },
  };
}

// custom, moved full index to daily
const createJobs = ({ getContext, queues, trigger = () => null }) => {
  const FullIndexQueue = queues.add('algolia-full-index-queue', queueOpts);

  FullIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * *' } });

  // add manual index trigger
  trigger('/manual-index', FullIndexQueue);
};

export { schema, Search as dataSource, resolver, createJobs as jobs };
