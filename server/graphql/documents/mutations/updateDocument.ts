import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdateDocumentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateDocument", {
      type: "Document",
      args: {
        documentId: nonNull(stringArg()),
        title: nullable(stringArg()),
        content: nullable(stringArg()),
      },
      resolve: async (
        _,
        { documentId, title, content },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (content)
          updateData = { ...updateData, content: JSON.parse(content) };

        const updatedDocument = await prisma.document.update({
          where: {
            id: documentId,
          },
          data: updateData,
        });

        return updatedDocument;
      },
    });
  },
});
