import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add your image hosting domains here
      // Example for WooCommerce product images:
      // {
      //   protocol: "https",
      //   hostname: "your-store.com",
      //   port: "",
      //   pathname: "/wp-content/uploads/**",
      // },
    ],
  },
};

export default nextConfig;
