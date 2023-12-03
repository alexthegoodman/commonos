import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const PresentationQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("presentation", {
      type: "Presentation",
      args: {
        presentationId: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { presentationId },
        { prisma, currentUser }: Context,
        x
      ) => {
        const presentation = await prisma.presentation.findFirst({
          where: {
            id: presentationId,
            creator: {
              id: currentUser.id,
            },
          },
        });

        return presentation;
      },
    });
  },
});
