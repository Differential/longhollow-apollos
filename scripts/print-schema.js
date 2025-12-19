const { isSchema, printSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Use the compiled server output so this runs in Heroku release phase.
const { schema, resolvers } = require('../lib/server');

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

process.stdout.write(printSchema(executableSchema));
