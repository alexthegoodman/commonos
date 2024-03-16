import { GraphQLClient } from "graphql-request";
import { graphqlUrl } from "./urls";

export class GQLClient {
  client: GraphQLClient | null = null;
  token: string = "";
  url: string = "";

  constructor(url: string) {
    this.url = url;
  }

  setupClient(token: string) {
    const self = this;
    this.token = token;
    this.client = new GraphQLClient(this.url, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
      // timeout: 10000, // 10s
    });

    return self;
  }

  async request(query: string, variables?: any) {
    if (!this.client) {
      throw new Error("Client not setup");
    }

    let data = null;
    try {
      data = await this.client.request(query, variables);
    } catch (error) {
      console.error("getUserData error", error);
      if (error.message.includes("JWT EXPIRED")) {
        window.location.href = "/login";
      } else if (error.message.includes("JWT MALFORMED")) {
        window.location.href = "/login";
      }
    }

    return data;
  }
}

const graphClient = new GQLClient(graphqlUrl);

export default graphClient;
