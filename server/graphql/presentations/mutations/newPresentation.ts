import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewPresentationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newPresentation", {
      type: "Presentation",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Presentation";

        const newPresentation = await prisma.presentation.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newPresentation", newPresentation);

        return newPresentation;
      },
    });
  },
});
