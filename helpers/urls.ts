export const env = process.env.NEXT_PUBLIC_APP_ENV;

export const protocol = env === "production" ? "https://" : "http://";

export const cookieDomain =
  env === "production" ? "commonos.cloud" : "localhost";

export const fullDomain =
  env === "production" ? "commonos.cloud" : process.env.NEXT_PUBLIC_HOST;

export const fullDomainPort =
  env === "production"
    ? "commonos.cloud"
    : process.env.NEXT_PUBLIC_HOST + ":3000";

export const graphqlUrl =
  env === "production"
    ? "https://api.commonos.cloud/graphql"
    : `http://localhost:4000/graphql`;
