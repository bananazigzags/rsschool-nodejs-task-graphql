import { Static, Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';
import {
  ChangePostInput,
  ChangeProfileInput,
  ChangeUserInput,
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
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberIdType } },
      resolve: async (
        _,
        { id }: { id: MemberTypeId },
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.memberType.findUnique({
          where: { id },
        });
      },
    },
    posts: {
      type: Posts,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.post.findUnique({
          where: { id },
        });
      },
    },
    users: {
      type: Users,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.user.findUnique({
          where: { id },
        });
      },
    },
    profiles: {
      type: Profiles,
      resolve: async (_, __, context: { prisma: PrismaClient }) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        return context.prisma.profile.findUnique({
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
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.user.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changeUser: {
      type: User,
      args: { id: { type: UUIDType }, dto: { type: ChangeUserInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createUserSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedUser = await context.prisma.user.update({
          where: { id },
          data: dto,
        });
        return updatedUser;
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.user.delete({ where: { id } });
        return `User ${id} deleted`;
      },
    },
    createPost: {
      type: Post,
      args: { dto: { type: CreatePostInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createPostSchema)['body']> },
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.post.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changePost: {
      type: Post,
      args: { id: { type: UUIDType }, dto: { type: ChangePostInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createPostSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedUser = await context.prisma.post.update({
          where: { id },
          data: dto,
        });
        return updatedUser;
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.post.delete({ where: { id } });
        return `Post ${id} deleted`;
      },
    },
    createProfile: {
      type: Post,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (
        _,
        { dto }: { dto: Static<(typeof createProfileSchema)['body']> },
        context: { prisma: PrismaClient },
      ) => {
        const createdUser = await context.prisma.profile.create({
          data: dto,
        });
        return createdUser;
      },
    },
    changeProfile: {
      type: Profile,
      args: { id: { type: UUIDType }, dto: { type: ChangeProfileInput } },
      resolve: async (
        _,
        { dto, id }: { dto: Static<(typeof createProfileSchema)['body']>; id: string },
        context: { prisma: PrismaClient },
      ) => {
        const updatedProfile = await context.prisma.profile.update({
          where: { id },
          data: dto,
        });
        return updatedProfile;
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }: { id: string }, context: { prisma: PrismaClient }) => {
        await context.prisma.profile.delete({ where: { id } });
        return `Profile ${id} deleted`;
      },
    },
    subscribeTo: {
      type: User,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        const subscribedToUser = await context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId,
              },
            },
          },
        });
        return subscribedToUser;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: { prisma: PrismaClient },
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
