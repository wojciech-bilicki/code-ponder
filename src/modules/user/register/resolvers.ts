import * as argon from 'argon2';
import Yup from 'yup';

import { MutationResolvers } from "../../../types";
import { User } from '../../../entity/User';

export const resolvers: MutationResolvers.Resolvers = {
  register: async (_, { input }) => {
    if (!input) {
      return {
        errors: []
      }
    }

    const { password, email, username } = input;

    const hashedPassword = await argon.hash(password)
    try {
      await User.create({
        email,
        username,
        password: hashedPassword
      }).save();
    } catch (e) {
      const { detail } = e;
      if (detail.includes('already exists.')) {
        if (detail.includes('email')) {
          return {
            errors: [
              {
                path: 'email',
                message: 'email already in use'
              }
            ]
          }
        } else if (detail.includes('username')) {
          return {
            errors: [
              {
                path: 'username',
                message: 'already taken'
              }
            ]
          }
        }
      }

    }
    return {
      errors: []
    }
  }
};

export default {
  Mutation: {
    ...resolvers
  }
}