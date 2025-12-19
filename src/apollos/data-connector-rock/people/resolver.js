import moment from 'moment-timezone';
import { createGlobalId } from '../../server-core/index.js';
import ApollosConfig from '../../config/index.js';
import { enforceCurrentUser } from '../utils.js';

export default {
  Mutation: {
    updateProfileField: (root, { input: { field, value } }, { dataSources }) =>
      dataSources.Person.updateProfile([{ field, value }]),
    updateProfileFields: (root, { input }, { dataSources }) =>
      dataSources.Person.updateProfile(input),
    uploadProfileImage: async (root, { file, size }, { dataSources }) =>
      dataSources.Person.uploadProfileImage(file, size),
  },
  Person: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    photo: async ({ photo }, args, { dataSources: { BinaryFiles } }) => ({
      uri: await BinaryFiles.findOrReturnImageUrl(photo), // protect against passing null photo
    }),
    birthDate: enforceCurrentUser(({ birthDate }) =>
      birthDate
        ? moment.tz(birthDate, ApollosConfig.ROCK.TIMEZONE).toJSON()
        : null
    ),
    gender: enforceCurrentUser(({ gender }, args, { dataSources }) =>
      dataSources.Person.mapGender({ gender })
    ),
    email: enforceCurrentUser(({ email }) => email),
  },
};
