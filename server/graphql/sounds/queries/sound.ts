import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const SoundQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("sound", {
      type: "Sound",
      args: {
        soundId: nonNull(stringArg()),
      },
      resolve: async (_, { soundId }, { prisma, currentUser }: Context, x) => {
        const sound = await prisma.sound.findFirst({
          where: {
            id: soundId,
            creator: {
              id: currentUser.id,
            },
          },
        });

        return sound;
      },
    });
  },
});
