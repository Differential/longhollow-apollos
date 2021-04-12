import gql from 'graphql-tag';
import { Person } from '@apollosproject/data-connector-rock';

const ONE_DAY = 60 * 60 * 24;

const schema = gql`
  ${Person.schema}

  extend type Person {
    htmlContent: String
    summary: String
    position: String
    ministry: String
    facebook: String
    twitter: String
    instagram: String
    website: String
  }

  extend type Query {
    getStaff(ministry: String): [Person]
  }
`;

const resolver = {
  Person: {
    ...Person.resolver.Person,
    email: async ({ id, email }, __, { dataSources }) => {
      // check for this first because the next data call takes a long time
      const { id: currentUserId } = await dataSources.Auth.getCurrentUser();
      if (id === currentUserId) return email;

      const staff = await dataSources.Person.getStaff();
      const person = staff.find((member) => member.id === id);
      return person ? person.email : null;
    },
    htmlContent: ({ attributeValues }) => attributeValues.description?.value,
    summary: ({ attributeValues }) => attributeValues.summary?.value,
    position: ({ attributeValues }) => attributeValues.position?.value,
    ministry: ({ attributeValues }) => attributeValues.ministry?.valueFormatted,
    facebook: ({ attributeValues }) => attributeValues.facebook?.value,
    twitter: ({ attributeValues }) => attributeValues.twitter?.value,
    instagram: ({ attributeValues }) => attributeValues.instagram?.value,
    website: ({ attributeValues }) => attributeValues.website?.value,
  },
  Query: {
    ...Person.resolver.Query,
    getStaff: (_, { ministry }, { dataSources }) =>
      dataSources.Person.getStaff({ ministry }),
  },
};

class dataSource extends Person.dataSource {
  expanded = true;

  getStaff = async ({ ministry = null } = {}) => {
    // this is the Rock admin RSR - Staff Workers group, should always be correct
    // as it's the only way staff have access to Rock back end
    const members = await this.request('GroupMembers')
      .filter('GroupId eq 3')
      .cache({ ttl: ONE_DAY })
      .get();
    const staff = await Promise.all(
      members.map(({ personId }) => this.getFromId(personId))
    );
    if (ministry)
      return staff.filter(
        (person) => person.attributeValues.ministry?.valueFormatted === ministry
      );
    return staff;
  };
}

export { schema, resolver, dataSource };
