import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdatePresentationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updatePresentation", {
      type: "Presentation",
      args: {
        presentationId: nonNull(stringArg()),
        title: nullable(stringArg()),
        context: nullable(stringArg()),
      },
      resolve: async (
        _,
        { presentationId, title, context },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (context)
          updateData = { ...updateData, context: JSON.parse(context) };

        const updatedPresentation = await prisma.presentation.update({
          where: {
            id: presentationId,
          },
          data: updateData,
        });

        return updatedPresentation;
      },
    });
  },
});
