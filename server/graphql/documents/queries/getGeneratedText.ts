import { extendType, nonNull, nullable, stringArg } from "nexus";
import { Context } from "../../../context";

export const GetGeneratedTextQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getGeneratedText", {
      type: "String",
      args: {
        contextText: nonNull(stringArg()),
      },
      resolve: async (
        _,
        { contextText },
        { prisma, openai, currentUser }: Context,
        x
      ) => {
        console.info("getGeneratedText", contextText);

        // get continuation text from openai
        const response = await openai.completions.create({
          model: "text-davinci-003",
          prompt: contextText,
          max_tokens: 50,
          temperature: 0.2,
        });

        console.info("openai response", response);

        return response.choices[0].text as string;
      },
    });
  },
});
