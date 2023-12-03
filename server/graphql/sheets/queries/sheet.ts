import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const SheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("sheet", {
      type: "Sheet",
      args: {
        sheetId: nonNull(stringArg()),
      },
      resolve: async (_, { sheetId }, { prisma, currentUser }: Context, x) => {
        const sheet = await prisma.sheet.findFirst({
          where: {
            id: sheetId,
            creator: {
              id: currentUser.id,
            },
          },
        });

        return sheet;
      },
    });
  },
});
