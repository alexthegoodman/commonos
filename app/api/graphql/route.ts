import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { server } from "@/server/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { context } from "../../../server/context";
import prisma from "@/server/prisma";

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  //   context: async (req) => ({ req }),
  context: async (req) => {
    // console.info("context event", event);
    const headers = req.headers;
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY as string;
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    let currentUser;

    try {
      // const tokenHeader = req.header(tokenHeaderKey);
      if (!headers) {
        throw new Error("No headers");
      }

      const tokenHeader = headers.get(tokenHeaderKey);
      const token = tokenHeader?.split("Bearer ")[1] as string;

      const verified = jwt.verify(token, jwtSecretKey);

      if (verified && typeof verified !== "string") {
        currentUser = await prisma.user.findFirst({
          where: {
            id: verified.userId,
          },
        });

        console.info("Verified Token", verified, "currentUser", currentUser);
      } else {
        console.warn("Token Not Verified 1");
      }
    } catch (error) {
      // ex. if token is not provided
      console.warn("Token Not Verified 2");
    }

    return { headers, currentUser, req, ...context };
  },
});

export { handler as GET, handler as POST };
