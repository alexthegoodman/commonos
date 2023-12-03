import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const MyPresentationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("myPresentations", {
      type: "Presentation",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        // TODO: tie to auth
        const presentations = await prisma.presentation.findMany({
          where: {
            creator: {
              id: currentUser.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return presentations;
      },
    });
  },
});
