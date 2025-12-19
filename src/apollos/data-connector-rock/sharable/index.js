export { sharableSchema as schema } from '../../data-schema/index.js';

export const resolver = {
  Sharable: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
};
