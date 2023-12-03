import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const UpdateSoundMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateSound", {
      type: "Sound",
      args: {
        soundId: nonNull(stringArg()),
        title: nullable(stringArg()),
        context: nullable(stringArg()),
      },
      resolve: async (
        _,
        { soundId, title, context },
        { prisma, currentUser }: Context,
        x
      ) => {
        let updateData = {};

        if (title) updateData = { ...updateData, title };
        if (context)
          updateData = { ...updateData, context: JSON.parse(context) };

        const updatedSound = await prisma.sound.update({
          where: {
            id: soundId,
          },
          data: updateData,
        });

        return updatedSound;
      },
    });
  },
});
