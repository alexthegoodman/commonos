import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const MyVideoQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("myVideos", {
      type: "Video",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        // TODO: tie to auth
        const videos = await prisma.video.findMany({
          where: {
            creator: {
              id: currentUser.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return videos;
      },
    });
  },
});
