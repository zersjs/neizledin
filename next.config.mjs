/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                pathname: "/t/p/**",
            },
            {
                protocol: "https",
                hostname: "i.ytimg.com",
                pathname: "/vi/**",
            },
            {
                protocol: "https",
                hostname: "cdn.sinemalar.com",
                pathname: "/images/**",
            },
        ],
        formats: ["image/avif", "image/webp"],
    },

    sassOptions: {
        silenceDeprecations: ["legacy-js-api", "import"],
    },

    // SEO: eski Vite/Movix rotalarından yeni Türkçe rotalara kalıcı yönlendirme
    async redirects() {
        return [
            { source: "/movie/:id", destination: "/film/:id", permanent: true },
            { source: "/tv/:id", destination: "/dizi/:id", permanent: true },
            {
                source: "/explore/movie",
                destination: "/kesfet/filmler",
                permanent: true,
            },
            {
                source: "/explore/tv",
                destination: "/kesfet/diziler",
                permanent: true,
            },
            { source: "/search/:query", destination: "/ara?q=:query", permanent: true },
        ];
    },

    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                ],
            },
        ];
    },
};

export default nextConfig;
