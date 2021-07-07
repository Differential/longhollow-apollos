import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';
import { createGlobalId } from '@apollosproject/server-core';

const { schema, resolver, jobs, dataSource: BaseSearch } = baseSearch;

const CATEGORIES = [
  'Messages',
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
    this.index.setSettings({
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

    // last name A-Z
    const nameIndex = this.client.initIndex('last_name_asc');
    nameIndex.setSettings({
      ranking: ['asc(lastName)'],
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

export { schema, Search as dataSource, resolver, jobs };
