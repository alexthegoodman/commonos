import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdateVideoMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateVideo", {
      type: "Video",
      args: {
        videoId: nonNull(stringArg()),
        title: nullable(stringArg()),
        context: nullable(stringArg()),
      },
      resolve: async (
        _,
        { videoId, title, context },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (context)
          updateData = { ...updateData, context: JSON.parse(context) };

        const updatedVideo = await prisma.video.update({
          where: {
            id: videoId,
          },
          data: updateData,
        });

        return updatedVideo;
      },
    });
  },
});
