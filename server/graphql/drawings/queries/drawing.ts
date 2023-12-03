import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const DrawingQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("drawing", {
      type: "Drawing",
      args: {
        drawingId: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { drawingId },
        { prisma, currentUser }: Context,
        x
      ) => {
        const drawing = await prisma.drawing.findFirst({
          where: {
            id: drawingId,
            creator: {
              id: currentUser.id,
            },
          },
        });

        return drawing;
      },
    });
  },
});
