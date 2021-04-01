import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';

const { schema, resolver, jobs, dataSource: BaseSearch } = baseSearch;

export class Search extends BaseSearch {
  async mapItemToAlgolia(item) {
    const node = await super.mapItemToAlgolia(item);

    const { data } = await graphql(
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
          }
        }
      }
      `,
      {},
      this.context
    );
    return {
      ...node,
      category: data.node.parentChannel?.name,
      location: data.node.campus?.name,
      ministry: data.node.ministry?.name,
      tripType: data.node.tripType,
    };
  }
}

export { schema, Search as dataSource, resolver, jobs };
