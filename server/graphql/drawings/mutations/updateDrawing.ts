import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdateDrawingMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateDrawing", {
      type: "Drawing",
      args: {
        drawingId: nonNull(stringArg()),
        title: nullable(stringArg()),
        context: nullable(stringArg()),
      },
      resolve: async (
        _,
        { drawingId, title, context },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (context)
          updateData = { ...updateData, context: JSON.parse(context) };

        const updatedDrawing = await prisma.drawing.update({
          where: {
            id: drawingId,
          },
          data: updateData,
        });

        return updatedDrawing;
      },
    });
  },
});
