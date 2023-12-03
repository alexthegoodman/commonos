import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewDrawingMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newDrawing", {
      type: "Drawing",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Drawing";

        const newDrawing = await prisma.drawing.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newDrawing", newDrawing);

        return newDrawing;
      },
    });
  },
});
