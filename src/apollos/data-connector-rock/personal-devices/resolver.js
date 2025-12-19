import { createGlobalId } from '#apollos/server-core/index.js';

export default {
  Device: {
    id: ({ id }) => createGlobalId(id, 'Device'),
    pushId: ({ deviceRegistrationId }) => deviceRegistrationId,
  },
  Person: {
    devices: ({ primaryAliasId }, args, { dataSources }) =>
      dataSources.PersonalDevice.getByPersonAliasId(primaryAliasId),
  },
};
