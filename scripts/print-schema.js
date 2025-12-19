import { isSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Ensure runtime config (config.yml/env expansion) is loaded during schema publish.
import '../src/config.js';

// Use the runtime server output for schema publishing.
import { schema, resolvers } from '../src/server.js';

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

process.stdout.write(printSchema(executableSchema));
