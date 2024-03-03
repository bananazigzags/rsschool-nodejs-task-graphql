import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';
import {
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
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
import { UUIDType } from './types/uuid.js';
import { createUserSchema } from '../users/schemas.js';
import { createPostSchema } from '../posts/schemas.js';
import { createProfileSchema } from '../profiles/schemas.js';

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
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
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
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
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
      resolve: async (_, { id }: { id: string }, context: PrismaClient) => {
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
    createUser: {
      type: User,
      args: { dto: { type: CreateUserInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createUserSchema)['body']> },
        context: PrismaClient,
      ) => {
        const createdUser = await context.user.create({
          data: dto,
        });
        return createdUser;
      },
    },
    createPost: {
      type: Post,
      args: { dto: { type: CreatePostInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createPostSchema)['body']> },
        context: PrismaClient,
      ) => {
        const createdUser = await context.post.create({
          data: dto,
        });
        return createdUser;
      },
    },
    createProfile: {
      type: Post,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createProfileSchema)['body']> },
        context: PrismaClient,
      ) => {
        const createdUser = await context.profile.create({
          data: dto,
        });
        return createdUser;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
