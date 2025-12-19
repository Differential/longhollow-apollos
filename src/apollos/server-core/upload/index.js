import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

export const schema = `
  scalar Upload
`;

export const resolver = {
  Upload: GraphQLUpload,
};

export const serverMiddleware = ({ app }) => {
  app.use(graphqlUploadExpress());
};
