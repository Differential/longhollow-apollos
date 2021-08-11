import { graphql } from 'graphql';
import Bugsnag from '@bugsnag/js';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';

const { schema, resolver, jobs, dataSource: BaseSearch } = baseSearch;

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

    // TODO take this out once we figure out what's causing indexing to fail
    try {
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
    } catch (e) {
      Bugsnag.notify(e);
      return node;
    }
  }
}

export { schema, Search as dataSource, resolver, jobs };
