import { graphql } from 'graphql';
import { createTestHelpers } from '#apollos/server-core/testUtils/index.js';
import { peopleSchema, deviceSchema } from '#apollos/data-schema/index.js';
import * as OneSignal from '../index.js';

const { getContext, getSchema } = createTestHelpers({ OneSignal });

describe('OneSignal', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema([peopleSchema, deviceSchema]);
    context = getContext();
  });

  it('updates an external push id with a valid user', async () => {
    const query = `
      mutation updatePushId {
        updateUserPushSettings(input: { pushProviderUserId: "some-push-id", enabled: false }) {
          id
        }
      }
    `;
    const rootValue = {};

    context.dataSources = {
      ...context.dataSources,
      Auth: {
        getCurrentPerson: jest.fn(() =>
          Promise.resolve({ primaryAliasId: 'user123', id: 'user123' })
        ),
      },
      Person: { getFromId: () => Promise.resolve({ id: 'user123' }) },
      PersonalDevice: { updateNotificationsEnabled: jest.fn() },
    };
    context.dataSources.OneSignal.put = jest.fn();

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.OneSignal.put).toMatchSnapshot();
    expect(
      context.dataSources.PersonalDevice.updateNotificationsEnabled
    ).toMatchSnapshot();
  });
});
