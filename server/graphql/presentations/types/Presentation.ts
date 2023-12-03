import { objectType } from "nexus";
import { Context } from "../../../context";

export const PresentationType = objectType({
  name: "Presentation",
  definition(t) {
    t.field("id", { type: "String" });
    t.field("title", { type: "String" });
    t.field("context", { type: "JSON" });

    t.field("creator", {
      type: "User",
      resolve: async (presentation, __, context: Context) => {
        // TODO: just get creatorId off presentation?
        return await context.prisma.user.findFirst({
          where: {
            presentations: {
              some: {
                id: presentation.id as string,
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
