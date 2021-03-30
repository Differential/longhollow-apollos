import { graphql } from 'graphql';
import * as baseSearch from '@apollosproject/data-connector-algolia-search';

const { schema, resolver, jobs, dataSource: BaseSearch } = baseSearch;

export class Search extends BaseSearch {
  baseMapItemToAlgolia = this.mapItemToAlgolia;

  async mapItemToAlgolia(item) {
    const node = await this.baseMapItemToAlgolia(item);

    const { data } = await graphql(
      this.context.schema,
      `
      query GetItem {
        node(id: "${node.id}") {
          ... on UniversalContentItem {
            campus { name }
            staff { name }
          }
        }
      }`,
      {},
      this.context
    );
    return {
      ...node,
      location: data.node.campus.name,
      ministry: data.node.staff.name,
    };
  }
}

export { schema, Search as dataSource, resolver, jobs };
