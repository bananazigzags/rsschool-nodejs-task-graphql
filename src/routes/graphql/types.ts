import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';

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
        { memberTypeId }: { memberTypeId: UUID },
        __,
        context: PrismaClient,
      ) => {
        return context.memberType.findUnique({
          where: { id: memberTypeId },
        });
      },
    },
  },
});

export const Profiles = new GraphQLList(Profile);

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async ({ id }: { id: UUID }, __, context: PrismaClient) => {
        return context.profile.findUnique({
          where: { userId: id },
        });
      },
    },
    posts: {
      type: Posts,
      resolve: async ({ id }: { id: UUID }, __, context: PrismaClient) => {
        return context.post.findMany({
          where: { authorId: id },
        });
      },
    },
  }),
});

export const Users = new GraphQLList(User);
