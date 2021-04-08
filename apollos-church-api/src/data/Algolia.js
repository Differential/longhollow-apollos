import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';

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
          isGroupEvent,
          speaker,
          topics,
          scriptures,
        },
        error,
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
            ministry { name }
            tripType
            daysAvailable
            serviceArea
            opportunityType
            relatedSkills
            isGroupEvent
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
    if (error) console.error(error);
    return {
      ...node,
      category: parentChannel?.name,
      location: campus?.name,
      ministry: ministry?.name,
      tripType,
      daysAvailable,
      serviceArea,
      opportunityType,
      relatedSkills,
      isGroupEvent,
      speaker,
      topics,
      bookOfTheBible: scriptures?.map(({ book }) => book),
    };
  }

  async indexAll() {
    await super.indexAll();

    // TODO add indexable people
  }
}

export { schema, Search as dataSource, resolver, jobs };
