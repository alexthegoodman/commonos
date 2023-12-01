export const env = process.env.NEXT_PUBLIC_APP_ENV;

export const protocol = env === "production" ? "https://" : "http://";

export const cookieDomain = env === "production" ? "commonos.app" : "localhost";

export const fullDomain =
  env === "production" ? "commonos.app" : process.env.NEXT_PUBLIC_HOST;

export const fullDomainPort =
  env === "production"
    ? "commonos.app"
    : process.env.NEXT_PUBLIC_HOST + ":3000";

export const graphqlUrl =
  env === "production" ? "" : `http://localhost:3000/api/graphql`;
