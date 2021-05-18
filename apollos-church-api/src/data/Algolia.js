import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';
import { createGlobalId } from '@apollosproject/server-core';

const { schema, resolver, jobs, dataSource: BaseSearch } = baseSearch;

export class Search extends BaseSearch {
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
      category: parentChannel?.name,
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
