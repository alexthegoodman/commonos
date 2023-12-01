import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const ExportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("export", {
      type: "String",
      args: {
        type: nonNull(stringArg()),
        html: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { type, html },
        { prisma, currentUser }: Context,
        x
      ) => {
        return "success";
      },
    });
  },
});
