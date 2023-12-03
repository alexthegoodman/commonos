import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdateSheetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSheet", {
      type: "Sheet",
      args: {
        sheetId: nonNull(stringArg()),
        title: nullable(stringArg()),
        context: nullable(stringArg()),
      },
      resolve: async (
        _,
        { sheetId, title, context },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (context)
          updateData = { ...updateData, context: JSON.parse(context) };

        const updatedSheet = await prisma.sheet.update({
          where: {
            id: sheetId,
          },
          data: updateData,
        });

        return updatedSheet;
      },
    });
  },
});
