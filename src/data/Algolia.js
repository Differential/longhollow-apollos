import * as baseSearch from '../apollos/data-connector-algolia-search/index.js';
import {
  createCursor,
  createGlobalId,
  parseCursor
} from '../apollos/server-core/index.js';
import { graphql } from 'graphql';
import Redis from 'ioredis';

const { schema, resolver, dataSource: BaseSearch } = baseSearch;

const CATEGORIES = [
  'Sermons',
  'Events',
  'Articles',
  'Mission Trips',
  'Volunteer Positions',
  'Service Opportunities',
  'Staff',
];

export class Search extends BaseSearch {
  constructor() {
    super();
    this.createReplicas();
  }

  createReplicas = async () => {
    await this.index.setSettings({
      replicas: [
        'title_asc',
        'publish_date_desc',
        'start_date_asc',
        'last_name_asc',
      ],
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

    // last name A-Z
    const nameIndex = this.client.initIndex('last_name_asc');
    nameIndex.setSettings({
      ranking: ['asc(lastName)'],
    });
  };

  async byPaginatedQuery({ query, after, first = 20 }) {
    const length = first;
    let offset = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        offset = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const { hits } = await this.index.search({
      query,
      length,
      offset,
      filters: 'NOT category:General',
    });
    return hits.map((node, i) => ({
      ...node,
      cursor: createCursor({ position: i + offset }),
    }));
  }

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

  async indexAll() {
    await super.indexAll();

    const { Person } = this.context.dataSources;
    const staff = await Person.getStaff();
    const staffIndex = await Promise.all(
      staff.map(async (person) => {
        const {
          data: {
            node: {
              id,
              position,
              firstName,
              lastName,
              summary,
              photo,
              campus,
              ministry,
            },
          },
        } = await graphql(
          this.context.schema,
          `
      {
        node(id: "${createGlobalId(person.id, 'Person')}") {
          id
          ... on Person {
            position
            firstName
            lastName
            summary
            photo { uri }
            campus { name }
            ministry
          }
        }
      }
      `,
          {},
          this.context
        );
        // try to match how content items are indexed so the front end layout will be easier to conform
        return {
          objectID: id,
          id,
          category: 'Staff',
          position,
          firstName,
          lastName,
          title: `${firstName} ${lastName}`,
          summary,
          coverImage: { sources: [{ uri: photo?.uri }] },
          location: campus?.name,
          ministry,
        };
      })
    );
    this.addObjects(staffIndex);
  }
}

const { REDIS_URL } = process.env;

let client;
let subscriber;
let _default;
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
  _default = new Redis(REDIS_URL, {
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
          return _default;
      }
    },
  };
}

// custom, moved full index to daily
const createJobs = ({ getContext, queues, trigger = () => null }) => {
  const FullIndexQueue = queues.add('algolia-full-index-queue', queueOpts);

  FullIndexQueue.process(() => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * *' }, attempts: 3 });

  // add manual index trigger
  trigger('/manual-index', FullIndexQueue);
};

export { schema, Search as dataSource, resolver, createJobs as jobs };
