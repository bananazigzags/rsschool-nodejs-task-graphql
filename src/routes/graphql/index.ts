import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validationErrors = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationErrors.length) return { errors: validationErrors };
      const res = await graphql({
        schema,
        source: req.body.query,
        contextValue: { prisma, dataloaders: new WeakMap() },
        variableValues: req.body.variables,
      });
      return res;
    },
  });
};

export default plugin;
