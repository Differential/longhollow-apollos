export { sharableSchema as schema } from 'apollos/data-schema';

export const resolver = {
  Sharable: {
    // Implementors must attach __typename to root.
    __resolveType: ({ __typename }) => __typename,
  },
};
