import { objectType } from "nexus";
import { Context } from "../../../context";

export const SoundType = objectType({
  name: "Sound",
  definition(t) {
    t.field("id", { type: "String" });
    t.field("title", { type: "String" });
    t.field("context", { type: "JSON" });

    t.field("creator", {
      type: "User",
      resolve: async (sound, __, context: Context) => {
        // TODO: just get creatorId off sound?
        return await context.prisma.user.findFirst({
          where: {
            sounds: {
              some: {
                id: sound.id as string,
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
