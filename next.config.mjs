/** @type {import('next').NextConfig} */
const nextConfig = {
  // include instrumentationHook experimental feature
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
