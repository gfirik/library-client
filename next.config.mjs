/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azqazfytscdrhrxldyci.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/books/**",
      },
    ],
  },
};

export default nextConfig;
