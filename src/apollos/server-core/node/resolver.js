export default {
  Query: {
    node: (root, { id }, { models, dataSources }, resolveInfo) =>
      models.Node.get(id, dataSources, resolveInfo),
  },
  Node: {
    __resolveType: ({ __typename, __type, apollosType }) =>
      __typename || apollosType || __type,
  },
};
