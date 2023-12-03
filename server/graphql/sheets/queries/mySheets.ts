import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const MySheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("mySheets", {
      type: "Sheet",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        // TODO: tie to auth
        const sheets = await prisma.sheet.findMany({
          where: {
            creator: {
              id: currentUser.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return sheets;
      },
    });
  },
});
