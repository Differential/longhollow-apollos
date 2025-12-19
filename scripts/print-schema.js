import { isSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Use the runtime server output for schema publishing.
import { schema, resolvers } from '../src/server.js';

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

process.stdout.write(printSchema(executableSchema));
