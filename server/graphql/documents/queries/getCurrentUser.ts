import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "../../../context";

export const CurrentUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getCurrentUser", {
      type: "User",
      args: {},
      resolve: async (
        _,
        {},
        { prisma, mixpanel, currentUser, req }: Context,
        x
      ) => {
        return currentUser;
      },
    });
  },
});
