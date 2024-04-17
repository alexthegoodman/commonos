/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // webpack: (config) => {
  //   config.externals = {
  //     canvas: "canvas",
  //   };
  //   return config;
  // },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    config.module.rules.push({
      test: /\.(wgsl|vs|fs|vert|frag)$/,
      use: ["shader-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
