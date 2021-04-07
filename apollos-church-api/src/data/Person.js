import gql from 'graphql-tag';
import { Person } from '@apollosproject/data-connector-rock';

const ONE_DAY = 60 * 60 * 24;

const schema = gql`
  ${Person.schema}

  extend type Person {
    htmlContent: String
    summary: String
    position: String
    facebook: String
    twitter: String
    instagram: String
    website: String
  }

  extend type Query {
    getStaff(ministry: ID): [Person]
  }
`;

const resolver = {
  Person: {
    ...Person.resolver.Person,
    // TODO if staff or current user, expose the email address
    email: async ({ id, email }, __, { dataSources: { Auth } }) => {
      const { id: currentUserId } = await Auth.getCurrentUser();
      return id === currentUserId ? email : null;
    },
    htmlContent: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'description'),
    summary: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'summary'),
    position: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'position'),
    facebook: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'facebook'),
    twitter: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'twitter'),
    instagram: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'instagram'),
    website: ({ id }, __, { dataSources }) =>
      dataSources.Person.getAttribute(id, 'website'),
  },
  Query: {
    ...Person.resolver.Query,
    getStaff: () => [],
  },
};

class dataSource extends Person.dataSource {
  expanded = true;

  getAttribute = async (id, attribute) => {
    const person = await this.request()
      .cache({ ttl: ONE_DAY })
      .find(id)
      .get();
    return person.attributeValues[attribute]?.value;
  };
}

export { schema, resolver, dataSource };
