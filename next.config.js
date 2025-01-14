/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "liveblocks.io",
            port: "",
          },
        ],
    },
}

module.exports = nextConfig