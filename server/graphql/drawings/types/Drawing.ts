import { objectType } from "nexus";
import { Context } from "../../../context";

export const DrawingType = objectType({
  name: "Drawing",
  definition(t) {
    t.field("id", { type: "String" });
    t.field("title", { type: "String" });
    t.field("context", { type: "JSON" });

    t.field("creator", {
      type: "User",
      resolve: async (drawing, __, context: Context) => {
        // TODO: just get creatorId off drawing?
        return await context.prisma.user.findFirst({
          where: {
            drawings: {
              some: {
                id: drawing.id as string,
              },
            },
          },
        });
      },
    });

    t.field("updatedAt", { type: "DateTime" });
    t.field("createdAt", { type: "DateTime" });
  },
});
