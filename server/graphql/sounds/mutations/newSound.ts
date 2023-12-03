import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const NewSoundMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("newSound", {
      type: "Sound",
      args: {},
      resolve: async (_, {}, { prisma, currentUser }: Context, x) => {
        let title = "New Sound";

        const newSound = await prisma.sound.create({
          data: {
            title,
            creator: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });

        console.info("newSound", newSound);

        return newSound;
      },
    });
  },
});
