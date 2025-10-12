/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    CUSTOM_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
