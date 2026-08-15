/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    useTypeScriptCli: true,
  },
  // pdfkit reads its .afm/.ttf data files at runtime via __dirname — bundling
  // it breaks that lookup, so keep it external (resolved from real node_modules).
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
}
module.exports = nextConfig
