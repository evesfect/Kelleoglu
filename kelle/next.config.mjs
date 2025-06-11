/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,
        net: false,
        dns: false,
        fs: false,
        request: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;