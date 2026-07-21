// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['as1.ftcdn.net', 'images.unsplash.com', 'res.cloudinary.com'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'files.edgestore.dev',
//         pathname: '/**',
//       },
//     ],
//   },
//   experimental: {
//     reactRefresh: false, // 🚫 Fast Refresh Disabled
//   },
// }

// export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns is the modern replacement for 'domains'
    remotePatterns: [
      { protocol: 'https', hostname: 'as1.ftcdn.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        pathname: '/**',
      },
    ],
  },
  // The experimental block is removed because reactRefresh is no longer valid here
}

export default nextConfig;