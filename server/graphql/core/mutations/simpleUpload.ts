import { extendType, intArg, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

import { put } from "@vercel/blob";
import Helpers from "@/helpers/Helpers";

export const SimpleUploadMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("simpleUpload", {
      type: "JSON",
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
        const filePath = helpers.getUploadDirectory(fileName);

        console.info("uploading file", filePath);

        let buffer;
        if (true) {
          buffer = Buffer.from(
            fileData.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
        }
        // else if (contentType === "video") {
        //   buffer = Buffer.from(
        //     base64.replace(/^data:video\/\w+;base64,/, ""),
        //     "base64"
        //   );
        // } else if (contentType === "audio") {
        //   buffer = Buffer.from(
        //     base64.replace(/^data:audio\/\w+;base64,/, ""),
        //     "base64"
        //   );
        // }

        const blob = await put(filePath, buffer, { access: "public" });

        return blob;
      },
    });
  },
});
