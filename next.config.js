/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            allowedOrigins: ["https://langchain-chatbot-wxihu.ondigitalocean.app"]
        }
    }
}

module.exports = nextConfig

