/** @type {import('next').NextConfig} */
const basepath = '/'
const { getBrowserEnv } = require('./setup-env')

const browserEnvs = getBrowserEnv(process.env.APP_ENV)
const nextConfig = {
    reactStrictMode: true,
    env: {
        basePath: basepath ? basepath : '',
        COOKIEDOMAIN: '.justdial.com',
        BROWSER_ENV: process.env.APP_ENV,
        ...browserEnvs,
        // buildId: '3c682e3a82eca0d2e858f3f59f21e3820a01d150',
    },
    generateBuildId: async () => {
        // return '3c682e3a82eca0d2e858f3f59f21e3820a01d150'
    },
    images: {
        domains: ['akam.cdn.jdmagicbox.com', 'images.jdmagicbox.com'],
    },
}

module.exports = nextConfig
