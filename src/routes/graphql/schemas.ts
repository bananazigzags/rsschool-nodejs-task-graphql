import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';
import {
  MemberIdType,
  MemberType,
  MemberTypes,
  Post,
  Posts,
  Profile,
  Profiles,
  User,
  Users,
} from './types.js';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUID } from 'crypto';
import { UUIDType } from './types/uuid.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: MemberTypes,
      resolve: async (_, __, context: PrismaClient) => {
        return context.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberIdType } },
      resolve: async (_, { id }: { id: MemberTypeId }, context: PrismaClient) => {
        return context.memberType.findUnique({
          where: { id },
        });
      },
    },
    posts: {
      type: Posts,
      resolve: async (_, __, context: PrismaClient) => {
        return context.post.findMany();
      },
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: UUID }, context: PrismaClient) => {
        return context.post.findUnique({
          where: { id },
        });
      },
    },
    users: {
      type: Users,
      resolve: async (_, __, context: PrismaClient) => {
        return context.user.findMany();
      },
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: UUID }, context: PrismaClient) => {
        return context.user.findUnique({
          where: { id },
        });
      },
    },
    profiles: {
      type: Profiles,
      resolve: async (_, __, context: PrismaClient) => {
        return context.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: UUID }, context: PrismaClient) => {
        return context.profile.findUnique({
          where: { id },
        });
      },
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    memberTypes: {
      type: MemberTypes,
      resolve: () => {
        return [{}];
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
