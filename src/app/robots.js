import { SITE } from "@/lib/seo";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Arama sonuçları ve API sonsuz sayıda ince URL üretir; taranmasın
                disallow: ["/ara", "/api/"],
            },
            {
                // Yapay zekâ tarayıcılarına içerik açık — marka görünürlüğü için
                userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
                allow: "/",
                disallow: ["/ara", "/api/"],
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    };
}
