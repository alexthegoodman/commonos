import { extendType, intArg, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

import { put } from "@vercel/blob";
import Helpers from "@/helpers/Helpers";

export const SimpleUploadMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("simpleUpload", {
      type: "Json",
      args: {
        fileName: nullable(stringArg()),
        fileSize: nullable(intArg()),
        fileType: nullable(stringArg()),
        fileData: nullable(stringArg()),
      },
      resolve: async (
        _,
        { fileName, fileSize, fileType, fileData },
        { prisma, currentUser }: Context,
        x
      ) => {
        const helpers = new Helpers();
        const filePath = helpers.getUploadDirectory() + fileName;

        console.info("uploading file", filePath);

        const blob = await put(filePath, fileData, { access: "public" });

        return blob;
      },
    });
  },
});
