import * as argon from 'argon2';

import { MutationResolvers } from "../../../types";
import { User } from '../../../entity/User';
import { getConnection } from "typeorm";


const invalidLoginResponse = {
  errors: [{
    path: "password",
    message: "Invalid login"
  }],
  user: null

}

export const resolvers: MutationResolvers.Resolvers = {
  login: async (_, { input }, { req }) => {

    const user = await getConnection().getRepository(User).createQueryBuilder("user").where("user.email = :email", { email: input.usernameOrEmail }).orWhere("user.username = :username", { username: input.usernameOrEmail }).getOne();

    if (!user) {
      return invalidLoginResponse
    }

    const valid = await argon.verify(user.password, input.password);

    if (!valid) {
      return invalidLoginResponse
    }

    req.session!.userId = user.id

    return {
      errors: [],
      user
    }

  }
}


export default {
  Mutation: {
    ...resolvers
  }
};