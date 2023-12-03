import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewVideoMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newVideo", {
      type: "Video",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Video";

        const newVideo = await prisma.video.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newVideo", newVideo);

        return newVideo;
      },
    });
  },
});
