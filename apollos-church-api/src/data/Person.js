import gql from 'graphql-tag';
import { Person } from '@apollosproject/data-connector-rock';

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

const ONE_DAY = 60 * 60 * 24;

class dataSource extends Person.dataSource {
  expanded = true;

  async getByMinistry({ ministry }) {
    const ministryValues = await this.request('DefinedValues')
      .select('Guid, Value')
      .filter('DefinedTypeId eq 117') // Ministries defined type
      .get();
    const currentMinistry = ministryValues.find(
      ({ value }) => value === ministry
    );

    if (!currentMinistry) return [];

    const peopleValuesForMinistry = await this.request('AttributeValues')
      .filter(`Value eq '${currentMinistry.guid}' and Attribute/Id eq 11993`) // People/Ministry attribute
      .get();

    return Promise.all(
      peopleValuesForMinistry.map(({ entityId }) => this.getFromId(entityId))
    );
  }

  getStaff = async ({ ministry = null } = {}) => {
    if (ministry) {
      return this.getByMinistry({ ministry });
    }
    const members = await this.request('GroupMembers')
      .filter('GroupId eq 3')
      .cache({ ttl: ONE_DAY })
      .get();
    return Promise.all(members.map(({ personId }) => this.getFromId(personId)));
  };
}

export { schema, resolver, dataSource };
