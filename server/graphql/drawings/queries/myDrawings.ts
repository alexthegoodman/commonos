import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const MyDrawingQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("myDrawings", {
      type: "Drawing",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        // TODO: tie to auth
        const drawings = await prisma.drawing.findMany({
          where: {
            creator: {
              id: currentUser.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return drawings;
      },
    });
  },
});
