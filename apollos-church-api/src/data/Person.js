import gql from 'graphql-tag';
import { Person } from '@apollosproject/data-connector-rock';

const schema = gql`
  ${Person.schema}

  extend type Person {
    bio: String
    summary: String
  }

  extend type Query {
    getStaff(ministry: ID): [Person]
  }
`;

const resolver = {
  ...Person.resolver,
  Query: {
    ...Person.resolver.Query,
    getStaff: () => [],
  },
};

const { dataSource } = Person;

export { schema, resolver, dataSource };
