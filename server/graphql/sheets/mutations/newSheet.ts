import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewSheetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newSheet", {
      type: "Sheet",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Sheet";

        const newSheet = await prisma.sheet.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newSheet", newSheet);

        return newSheet;
      },
    });
  },
});
