/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains:["lh3.googleusercontent.com"]
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "s3.amazonaws.com",
    //     port: "",
    //     pathname: "/my-bucket/**",
    //   },
    // ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};

module.exports = nextConfig;



