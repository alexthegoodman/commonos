import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const VideoQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("video", {
      type: "Video",
      args: {
        videoId: nonNull(stringArg()),
      },
      resolve: async (_, { videoId }, { prisma, currentUser }: Context, x) => {
        const video = await prisma.video.findFirst({
          where: {
            id: videoId,
            creator: {
              id: currentUser.id,
            },
          },
        });

        return video;
      },
    });
  },
});
