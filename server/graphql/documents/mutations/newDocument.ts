import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewDocumentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newDocument", {
      type: "Document",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Document";

        const newDocument = await prisma.document.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newDocument", newDocument);

        return newDocument;
      },
    });
  },
});
