import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { createTestHelpers } from '../server-core/testUtils/index.js';
import { authSchema } from '../data-schema/index.js';
import { Person } from '../data-connector-rock/index.js';
import { createGlobalId } from '../server-core/index.js';
import { gql } from 'apollo-server';

import { generateToken } from '../data-connector-rock/auth/index.js';
import * as Pass from './index.js';
import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);




class AuthDataSourceMock {
  initialize = () => {};

  getCurrentPerson = () => ({
    id: 51,
    firstName: 'Isaac',
    lastName: 'Hardy',
    nickName: 'Isaac',
    email: 'isaac.hardy@newspring.cc',
    photo: {
      url:
        'https://apollosrock.newspring.cc:443/GetImage.ashx?guid=60fd5f35-3167-4c26-9a30-d44937287b87',
    },
  });

  getCurrentPersonAlternateLookupId = () => '0faad2f-3258f47';
}

const Auth = {
  schema: authSchema,
  dataSource: AuthDataSourceMock,
  resolver: { Query: { currentUser: () => ({ profile: { id: 51 } }) } },
};

const { getContext, getSchema } = createTestHelpers({
  Pass,
  Person,
  Auth,
  Theme: {
    schema: gql`
      scalar Color
    `,
  },
});

describe('Passes', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema();
    context = getContext();

    fetch.resetMocks();
    fetch.mockLiveDataSourceApis();
  });

  describe('as a logged in user', () => {
    beforeEach(() => {
      const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });
      context = getContext({
        req: {
          headers: { authorization: token },
        },
      });
    });

    it('queries by node', async () => {
      const id = createGlobalId('EXAMPLE', 'Pass');
      const query = `
        query {
          node(id: "${id}") {
            ...on Pass {
              id
              type
              description
              logo { uri }
              thumbnail { uri }
              barcode { uri }
              primaryFields {
                key
                label
                value
                textAlignment
              }
              secondaryFields {
                key
                label
                value
                textAlignment
              }
              backgroundColor
              foregroundColor
              labelColor
              logoText
              passkitFileUrl
            }
          }
        }
      `;
      const rootValue = {};

      logOutput({ context });

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('returns the checkin pass', async () => {
      const query = `
        query {
          userPass {
            id
            type
            description
            logo { uri }
            thumbnail { uri }
            barcode { uri }
            primaryFields {
              key
              label
              value
              textAlignment
            }
            secondaryFields {
              key
              label
              value
              textAlignment
            }
            backgroundColor
            foregroundColor
            labelColor
            logoText
            passkitFileUrl
          }
        }
      `;
      const rootValue = {};
      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });
  });
});
