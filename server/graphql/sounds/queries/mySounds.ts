import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const MySoundQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("mySounds", {
      type: "Sound",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        // TODO: tie to auth
        const sounds = await prisma.sound.findMany({
          where: {
            creator: {
              id: currentUser.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return sounds;
      },
    });
  },
});
