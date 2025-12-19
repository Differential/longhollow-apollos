import { graphql } from 'graphql';
import { createTestHelpers } from '#apollos/server-core/testUtils/index.js';

import {
  campusSchema,
  peopleSchema,
  interfacesSchema,
  contentItemSchema,
  contentChannelSchema,
  themeSchema,
  scriptureSchema,
} from '#apollos/data-schema/index.js';
import * as Event from '../index.js';
import { Campus } from '../../index.js';

const { getSchema, getContext } = createTestHelpers({
  Event,
  Campus,
});

describe('Events resolver', () => {
  let schema;
  let context;
  let rootValue;
  beforeEach(() => {
    schema = getSchema([
      campusSchema,
      peopleSchema,
      interfacesSchema,
      contentItemSchema,
      contentChannelSchema,
      themeSchema,
      scriptureSchema,
    ]);
    context = getContext();
    rootValue = {};
  });

  it('gets events by campus', async () => {
    const query = `
      query {
        campuses {
          events {
            id
            name
            location
            start
            end
          }
        }
      }
    `;

    context.dataSources.Campus.getByLocation = jest.fn(() =>
      Promise.resolve([{ id: 1 }])
    );
    context.dataSources.Event.getByCampus = jest.fn(() =>
      Promise.resolve([
        { id: 1, campusId: 1, scheduleId: 1, location: '123 Main St' },
      ])
    );
    context.dataSources.Event.getName = jest.fn(() =>
      Promise.resolve('Cookout')
    );
    // for testing the getDateTime datasource function...
    context.dataSources.Event.request = () => ({
      filter: () => ({
        first: () =>
          Promise.resolve({
            iCalendarContent:
              'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
          }),
      }),
    });

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
