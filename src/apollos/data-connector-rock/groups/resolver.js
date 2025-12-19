import { createGlobalId } from '../../server-core/index.js';
import { enforceCurrentUser } from '../utils.js';

export default {
  Group: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    leaders: ({ id }, args, { dataSources }) =>
      dataSources.Group.getLeaders(id),
    members: ({ id }, args, { dataSources }) =>
      dataSources.Group.getMembers(id),
  },
  Person: {
    groups: enforceCurrentUser(({ id }, { type, asLeader }, { dataSources }) =>
      dataSources.Group.getByPerson({ personId: id, type, asLeader })
    ),
  },
};
