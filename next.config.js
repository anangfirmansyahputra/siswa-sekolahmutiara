/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

module.exports = {
    webpack: (config) => {
        config.resolve.alias["@emotion/core"] = "@emotion/react";
        return config;
    },
};

module.exports = nextConfig;
