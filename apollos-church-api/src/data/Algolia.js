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
          series,
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
            scriptures
            series
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
      ministry: ministry?.name,
      tripType,
      daysAvailable,
      serviceArea,
      opportunityType,
      relatedSkills,
      isGroupEvent,
      speaker,
      topics,
      // TODO get only the books from the reference, could probably be a core
      // feature to add "book" as a field on Scripture GQL type
      bookOfTheBible: null,
      series,
    };
  }
}

export { schema, Search as dataSource, resolver, jobs };
