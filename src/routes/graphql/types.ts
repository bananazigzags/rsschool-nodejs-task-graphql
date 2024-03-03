import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient, SubscribersOnAuthors } from '@prisma/client';
import { userSchema } from '../users/schemas.js';
import { Static } from '@sinclair/typebox';
import { profileSchema } from '../profiles/schemas.js';

export const MemberIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const MemberTypes = new GraphQLList(MemberType);

export const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authodId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const Posts = new GraphQLList(Post);

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberIdType) },
    memberType: {
      type: MemberType,
      resolve: async (
        parent: Static<typeof profileSchema>,
        __,
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  },
});

export const Profiles = new GraphQLList(Profile);

export const User: GraphQLObjectType<
  {
    id: string;
    name: string;
    balance: number;
    userSubscribedTo?: Array<SubscribersOnAuthors>;
    subscribedToUser?: Array<SubscribersOnAuthors>;
  },
  { prisma: PrismaClient }
> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (
        parent: Static<typeof userSchema>,
        __,
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: Posts,
      resolve: async (
        parent: Static<typeof userSchema>,
        __,
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (
        parent: Static<typeof userSchema>,
        __,
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (
        parent: Static<typeof userSchema>,
        __,
        context: { prisma: PrismaClient },
      ) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const Users = new GraphQLList(User);

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberIdType) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberIdType },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  },
});
