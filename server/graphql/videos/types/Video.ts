import { objectType } from "nexus";
import { Context } from "../../../context";

export const VideoType = objectType({
  name: "Video",
  definition(t) {
    t.field("id", { type: "String" });
    t.field("title", { type: "String" });
    t.field("context", { type: "JSON" });

    t.field("creator", {
      type: "User",
      resolve: async (video, __, context: Context) => {
        // TODO: just get creatorId off video?
        return await context.prisma.user.findFirst({
          where: {
            videos: {
              some: {
                id: video.id as string,
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
