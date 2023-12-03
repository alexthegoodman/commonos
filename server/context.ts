import { User } from "@prisma/client";
import MixpanelClient from "../helpers/mixpanel";

import OpenAI from "openai";
import { NextRequest } from "next/server";
import prisma from "./prisma";

const openai = new OpenAI({
  organization: "org-27u0QhfhY8rWqMDmiUBdRw6E",
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

const mixpanel = new MixpanelClient();

export interface Context {
  prisma: PrismaClient;
  mixpanel: MixpanelClient;
  req: NextRequest;
  currentUser: User;
  openai: OpenAI;
}

export const context = {
  prisma,
  mixpanel,
  openai,
};
