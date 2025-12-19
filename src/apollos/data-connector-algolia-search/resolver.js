import { withEdgePagination } from '../server-core/index.js';
import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);




const resolver = {
  Query: {
    search: async (root, input, { dataSources }) =>
      dataSources.Search.byPaginatedQuery(input),
  },
  SearchResultsConnection: {
    edges: (edges) => edges,
    pageInfo: (edges) => withEdgePagination({ edges }),
  },
  SearchResult: {
    node: async ({ id }, _, { models, dataSources }, resolveInfo) => {
      try {
        return await models.Node.get(id, dataSources, resolveInfo);
      } catch (e) {
        // Right now we don't have a good mechanism to flush deleted items from the search index.
        // This helps make sure we don't return something unresolvable.
        logOutput(`Error fetching search result ${id}`, e);
        return null;
      }
    },
  },
};

export default resolver;
